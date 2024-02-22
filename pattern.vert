// out variables to be interpolated in the rasterizer and sent to each fragment shader:
varying  vec2  vST;	  // (s,t) texture coordinates

// where the light is:

void
main( )
{
	vST = gl_MultiTexCoord0.st;
	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}
