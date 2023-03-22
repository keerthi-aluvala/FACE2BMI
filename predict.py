import pickle
import sys
import librosa
import soundfile
import joblib 
import numpy as np

model = joblib.load('model_joblib')
def extract_feature(file_name, mfcc, chroma, mel):
    with soundfile.SoundFile(file_name) as sound_file:
        X = sound_file.read(dtype="float32")
        sample_rate=sound_file.samplerate
        if chroma:
            stft=np.abs(librosa.stft(X))
        result=np.array([])
        if mfcc:
            mfccs=np.mean(librosa.feature.mfcc(y=X, sr=sample_rate, n_mfcc=40).T, axis=0)
            result=np.hstack((result, mfccs))
        if chroma:
            chroma=np.mean(librosa.feature.chroma_stft(S=stft, sr=sample_rate).T,axis=0)
            result=np.hstack((result, chroma))
        if mel:
            mel=np.mean(librosa.feature.melspectrogram(X, sr=sample_rate).T,axis=0)
            result=np.hstack((result, mel))
    return result
#feature=extract_feature(str(sys.argv[1]), mfcc=True, chroma=True, mel=True)
feature=extract_feature(str(sys.argv[1]), mfcc=True, chroma=True, mel=True)

feature=feature.reshape(1,-1)
# use model to predict



prediction=model.predict(feature)
print(prediction)