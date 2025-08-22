import pandas as pd
import numpy as np
import os
from tqdm import tqdm
from PIL import Image
df = pd.read_csv('fer2013.csv')

emotions = {
    0: "angry",
    1: "disgusted",
    2: "fearful",
    3: "happy",
    4: "sad",
    5: "surprised",
    6: "neutral"
}

for outer_name in ['train', 'test']:
    for emotion in emotions.values():
        os.makedirs(os.path.join('data', outer_name, emotion), exist_ok=True)

print("Saving images...")

counts = {emo: 0 for emo in emotions.values()}

for idx, row in tqdm(df.iterrows(), total=len(df)):
    emotion = emotions[row['emotion']]
    pixels = list(map(int, row['pixels'].split()))
    usage = row['Usage']

    img = np.array(pixels).reshape(48, 48)
    img = Image.fromarray(img.astype(np.uint8))
    if 'Training' in usage:
        folder = 'train'
    else:
        folder = 'test'
    filename = f"data/{folder}/{emotion}/im{counts[emotion]}.png"
    img.save(filename)
    counts[emotion] += 1

print("Dataset prepared successfully!")
