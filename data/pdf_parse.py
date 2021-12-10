#you need to have the following dependencies to make it work
#sudo apt install build-essential libpoppler-cpp-dev pkg-config python3-dev
#pip install pdftotext
import pdftotext as pdt
def process_pair(txt1,txt2):
    pdf=[txt1,txt2]
    splitted=pdf[0].split('\n')
    for idx,line in enumerate(splitted):
        if 'Line ' in line:
            passage=splitted[idx-3:]
            recombined=''
            for line in passage:
                recombined+=line+'\n'
            break
    #gets question
    ssplit=pdf[1].split('\n')
    q=ssplit[0]
    choices=recombine_split(ssplit[1:5])
    answer=recombine_split(ssplit[6:-2])  
    difficulty=ssplit[-2]
    return (recombined,q,choices,answer,difficulty)
def test(fname):
    with open(fname,'rb') as r:
        read=pdt.PDF(r)
        return process_pair(read[0],read[1])
def process_full_pdf(fname,output_fname,mode='a'):
    with open(fname,'rb') as r:
        read=pdt.PDF(r)
        with open(output_fname,mode) as csv:
            for i in range(0,len(read),2):
                res=process_pair(read[i],read[i+1])
                line=''
                for j in range(len(res)-1):
                    line+=res[j].replace('\n','<>')+'|'
                line+=res[-1]+'\n'
                csv.write(line)
def read_csv(fname,line):
    with open(fname,'r') as file:
        lines=list(file)
        important=lines[line].replace('<>','\n')
        for i in important.split('|'):
            print(i)

#making sure it runs correctly
process_full_pdf('SAT Suite Question Bank-20q.pdf','test1')
read_csv('test1',2)
