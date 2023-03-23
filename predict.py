import pickle
import sys
import librosa
import soundfile
import joblib 
import numpy as np
import tensorflow as tf
from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
from sklearn.linear_model import Ridge

model = joblib.load('G:\\sem VII\\MajorProject\\ourcode\\BMI\\bmi_predictor.model')

resnet = ResNet50(weights='imagenet', include_top=False, input_shape=(224, 224, 3))


def extract_feature(file_name):
    new_image = tf.keras.preprocessing.image.load_img(file_name, target_size=(224, 224))
    new_image = np.array(tf.keras.preprocessing.image.img_to_array(new_image))
    new_image = preprocess_input(new_image[np.newaxis, ...])
    features = resnet.predict(new_image)
    features = features.reshape(features.shape[0], -1)
    prediction = model.predict(features)
    result = prediction[0]
    return result
    
#feature=extract_feature(str(sys.argv[1]), mfcc=True, chroma=True, mel=True)
feature=extract_feature(str(sys.argv[1]))



print(feature)