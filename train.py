HF_REPO = "valerieliang/reddit-sentiment-model"

from datasets import load_dataset
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    TrainingArguments,
    Trainer,
)
import numpy as np
import evaluate
import torch

MODEL_NAME = "distilbert-base-uncased"
OUTPUT_DIR = "./trained-model"

# Load data 
print("Loading go_emotions dataset...")
dataset = load_dataset("go_emotions", "simplified")
# simplified has 28 labels, multi-label (each post can have multiple emotions)
NUM_LABELS = 28

# Tokenize 
tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

def tokenize(batch):
    tokens = tokenizer(
        batch["text"],
        truncation=True,
        padding="max_length",
        max_length=128,
    )
    # go_emotions labels are lists of ints — convert to one-hot float vectors
    one_hot = np.zeros((len(batch["text"]), NUM_LABELS), dtype=np.float32)
    for i, label_list in enumerate(batch["labels"]):
        for l in label_list:
            one_hot[i][l] = 1.0
    tokens["labels"] = one_hot.tolist()
    return tokens

print("Tokenizing...")
tokenized = dataset.map(tokenize, batched=True, remove_columns=dataset["train"].column_names)
tokenized.set_format("torch")

# Model 
model = AutoModelForSequenceClassification.from_pretrained(
    MODEL_NAME,
    num_labels=NUM_LABELS,
    problem_type="multi_label_classification",
)

# Metrics 
f1_metric = evaluate.load("f1")

def compute_metrics(eval_pred):
    logits, labels = eval_pred
    preds = (logits > 0).astype(int)
    return f1_metric.compute(
        predictions=preds.flatten(),
        references=labels.flatten(),
        average="micro",
    )

# Training args 
args = TrainingArguments(
    output_dir=OUTPUT_DIR,
    num_train_epochs=3,
    per_device_train_batch_size=32,
    per_device_eval_batch_size=64,
    evaluation_strategy="epoch",
    save_strategy="epoch",
    load_best_model_at_end=True,
    metric_for_best_model="f1",
    push_to_hub=True,
    hub_model_id=HF_REPO,
    logging_steps=100,
    fp16=torch.cuda.is_available(),   # half precision if GPU available
)

# Train 
trainer = Trainer(
    model=model,
    args=args,
    train_dataset=tokenized["train"],
    eval_dataset=tokenized["validation"],
    compute_metrics=compute_metrics,
)

print("Starting training...")
trainer.train()

print("Pushing to HuggingFace Hub...")
trainer.push_to_hub()
tokenizer.save_pretrained(OUTPUT_DIR)
tokenizer.push_to_hub(HF_REPO)

print(f"Done. Model live at https://huggingface.co/{HF_REPO}")