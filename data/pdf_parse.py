#you need to have the following dependencies to make it work
#sudo apt install build-essential libpoppler-cpp-dev pkg-config python3-dev
#pip install pdftotext
import pdftotext as pdt

def recombine_split(x):
    recombined = ''
    for line in x:
        recombined += line + '\n'
    return recombined
def process_pair(txt1, txt2):
    pdf=[txt1, txt2]
    splitted = pdf[0].split('\n')
    for idx, line in enumerate(splitted):
        if 'Line ' in line:
            passage = splitted[idx-3:]
            recombined = ''
            for line in passage:
                recombined += line + '\n'
            break
    print(recombined)
    #gets question
    ssplit=pdf[1].split('\n')
    q=ssplit[0]
    choices=recombine_split(ssplit[1:5])
    answer=recombine_split(ssplit[6:-2])
    difficulty=ssplit[-2]
    return (recombined,q,choices,answer,difficulty)
  
