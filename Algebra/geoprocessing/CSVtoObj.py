import os
import csv
import json

file = r"C:\data\raster\Geospatial.csv"
resultfile = "C:\\temp\\output.txt"

with open(resultfile, 'w') as outfile:
    with open(file, 'rb') as csvfile:
         reader = csv.reader(csvfile)
         for row in reader:
             filename = row[0]
             obj =  { 'title':row[2], 'index':row[1], 'source':row[3] }
             json_string = json.dumps(obj, ensure_ascii=False);
             outfile.write("\"" + row[0] + "\"" + ":" + json_string + ",");
             print json_string


    