import csv

idxDict = {}

with open('links.csv', 'r') as csvfile:
	tempReader = csv.reader(csvfile, delimiter=',')
	for line in tempReader:
		#print(line)
		idxDict[line[0]] = line[2]

outputList = []
with open('ratings.csv', 'r') as csvfile:
	tempReader = csv.reader(csvfile, delimiter=',')
	for line in tempReader:
		tempList = []
		tempList.append( line[0] )
		tempList.append( idxDict[line[1]] )
		tempList.append( line[2] )
		outputList.append( tempList )

with open('ratingsTMDB.csv', 'w') as csvfile:
	tempWriter = csv.writer(csvfile)
	for row in outputList:
		tempWriter.writerow( row )