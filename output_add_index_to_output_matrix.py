import csv

tempList = []

with open('Final_output.csv', 'r') as csvfile:
	reader = csv.reader(csvfile, delimiter=',')
	for row in reader:
		n = len(row)
		tempList.append( row )
#		print(tempList[0])
#		exit()

headerList = [i for i in range(n)]

with open('processed_output.csv', 'w') as csvfile:
	writer = csv.writer(csvfile, delimiter=',')
	writer.writerow( headerList )
	for row in tempList:
		writer.writerow( row )

#print(headerList)
