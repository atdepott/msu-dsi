import csv

infile = open("C:\Temp\gl_centroids.csv",'rb')
outfile = open("C:\Temp\popcentroids_time.csv",'wb')

try:
    writer = csv.writer(outfile,quoting=csv.QUOTE_NONNUMERIC)    
    reader = csv.reader(infile)
    rownum = 0
    for row in reader:
        adminid = row[0]
        name1 = row[1]
        name2 = row[2]
        name3 = row[3]
        name4 = row[4]
        name5 = row[5]
        code = row[6]
        iso = row[7]
        country = row[8]
        long = row[9]
        lat = row[10]
        area = row[13]
        p90 = row[14]
        p95 = row[15]
        p00 = row[16]
        p05 = row[17]
        p10 = row[18]
        p15 = row[19]
            
        if (rownum == 0):    
            writer.writerow([adminid, name1, name2, name3, name4, name5, code, iso, country, long, lat, area, "'YEAR'", "'POPULATION'"]);
        else:
            writer.writerow([adminid, name1, name2, name3, name4, name5, code, iso, country, long, lat, area, '1990', p90]);
            writer.writerow([adminid, name1, name2, name3, name4, name5, code, iso, country, long, lat, area, '1995', p95]);
            writer.writerow([adminid, name1, name2, name3, name4, name5, code, iso, country, long, lat, area, '2000', p00]);
            writer.writerow([adminid, name1, name2, name3, name4, name5, code, iso, country, long, lat, area, '2005', p05]);
            writer.writerow([adminid, name1, name2, name3, name4, name5, code, iso, country, long, lat, area, '2010', p10]);
            writer.writerow([adminid, name1, name2, name3, name4, name5, code, iso, country, long, lat, area, '2015', p15]);
        rownum+=1

except Exception as e:
    print "ERROR: " + str(rownum)
    print e

finally:
    infile.close()
    outfile.close()