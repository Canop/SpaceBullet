var sb = sb || {};
(function(){

	// returns the squared distance between the [(x1,x2),(y1,y2)] segment and the point (px, py)
	// Adapted from Sun's java.awt.geom.Line2D code (which is GPL2)
	sb.ptSegDistSq = function(x1, y1, x2, y2, px, py) {
		// x2,y2 becomes relative vector from x1,y1 to end of segment
        x2 -= x1;
		y2 -= y1;
		// px,py becomes relative vector from x1,y1 to test point
		px -= x1;
		py -= y1;
		var dotprod = px * x2 + py * y2;
		var projlenSq;
		if (dotprod <= 0.0) {
             // px,py is on the side of x1,y1 away from x2,y2
             // distance to segment is length of px,py vector
             // "length of its (clipped) projection" is now 0.0
             projlenSq = 0.0;
        } else {
            // switch to backwards vectors relative to x2,y2
             // x2,y2 are already the negative of x1,y1=>x2,y2
             // to get px,py to be the negative of px,py=>x2,y2
             // the dot product of two negated vectors is the same
             // as the dot product of the two normal vectors
             px = x2 - px;
             py = y2 - py;
             dotprod = px * x2 + py * y2;
             if (dotprod <= 0.0) {
                 // px,py is on the side of x2,y2 away from x1,y1
                 // distance to segment is length of (backwards) px,py vector
                 // "length of its (clipped) projection" is now 0.0
                 projlenSq = 0.0;
             } else {
                 // px,py is between x1,y1 and x2,y2
                 // dotprod is the length of the px,py vector
                 // projected on the x2,y2=>x1,y1 vector times the
                 // length of the x2,y2=>x1,y1 vector
                 projlenSq = dotprod * dotprod / (x2 * x2 + y2 * y2);
             }
         }
         // Distance to line is now the length of the relative point
         // vector minus the length of its projection onto the line
         // (which is zero if the projection falls outside the range
         //  of the line segment).
         var lenSq = px * px + py * py - projlenSq;
         if (lenSq < 0) {
             lenSq = 0;
         }
         return lenSq;
     }

})();


