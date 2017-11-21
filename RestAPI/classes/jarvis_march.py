class Point:
    def __init__(self, xCoord = 0, yCoord = 0):
        self.x = xCoord
        self.y = yCoord

class JarvisMarch:
    def jarvisMarch(self, points, n):
        if n < 3: return
        hull = []
        
        #Init Leftmost point
        l = 0
        for x in range(1,n):
            if float(points[x].x) < float(points[l].x):
                l = x
                
        #print( str(points[l].x) + ',' + str(points[l].y) )
        p = l
        while True:
            hull.append(points[p])
            q = (p + 1) % n
            
            for i in range(0, n):
                value = self.orientation(points[p], points[i], points[q])
                if ( value == 2):
                    q = i
            
            p = q
            
            if (p == l):
                break
                
        return hull

    def orientation(self,p, q, r):
        
        val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y)
        
        if (val == 0): return 0  #collinear
        
        #clock or counterclock wise
        if (val > 0): return 1
        else: return 2  

    def getPolygon(self,polyCluster):
        points = []
        for obj in polyCluster:
            point = Point(float(obj['Longitude']), float(obj['Latitude']))
            points.append(point)
        hull = self.jarvisMarch(points, len(points))
        return hull

    def createPolyGEOJSON(self,data):
        geojson = {}
        geojson["type"] = "FeatureCollection"
        features = []
        for node in data:
            geoObj = {}
            geometry = {}
            coordinates = [node]
            geometry["type"] = "Polygon"
            geometry["coordinates"] = coordinates

            geoObj["geometry"] = geometry

            features.append(geoObj)

        geojson["features"] = features
        return geojson

    def pointsToGEO(self,polyPoints):
        output = []
        poly = []
        for hull in polyPoints:
            temp = []
            for point in hull:
                coords = []
                coords.append(point.x)
                coords.append(point.y)
                temp.append(coords)

            poly.append(temp)

        output.append(self.createPolyGEOJSON(poly))
        return output


