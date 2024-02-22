// lighting uniform variables -- these can be set once and left alone:
uniform float   uKa, uKd, uKs;	 // coefficients of each type of lighting -- make sum to 1.0
uniform vec3    uColor;		 // object color
uniform vec3    uSpecularColor;	 // light color
uniform float   uShininess;	 // specular exponent


// in variables from the vertex shader and interpolated in the rasterizer:
varying  vec2  vST;		   // (s,t) texture coordinates

uniform float uPower;
uniform float uRtheta;
uniform float uMosaic;
uniform float uBlend;
uniform sampler2D uHorsePic;
uniform sampler2D uDogPic;
const float PI= 2.*3.14159265;
const vec4 BLACK = vec4( 0., 0., 0., 1. );

float
atan2( float y, float x )
{
        if( x == 0. )
        {
                if( y >= 0. )
                        return  PI/2.;
                else
                        return -PI/2.;
        }
        return atan(y,x);
}

void
main( )
{
	
	float s = vST.s;
	float t = vST.t;
	vec2 st;
	float r;
	float r1;


	st = vST - vec2(0.5,0.5);  // put (0,0) in the middle so that the range is -0.5 to +0.5
	r = length(st);
	r1 = pow(2.0*r,uPower);
	

	float whirl= atan2(st.t, st.s );
	float whirl1 = whirl - uRtheta * r;
	
	st = r1 * vec2( cos(whirl1),sin(whirl1));  		
	st += vec2(1.0,1.0);                    		// change the range to 0. to +2.
	st *= vec2(0.5,0.5);       			// change the range to 0. to +1.

	float Ar = uMosaic/2.;
	float Br = uMosaic/2.;

	int numins = int(st / uMosaic ); 
	int numint = int(st / uMosaic); 
	
	float sc = float(numins) *uMosaic + Ar; 
	float tc = float(numint) *uMosaic + Br;	// same as with the ellipses

	// for this block of pixels, we are only going to sample the texture at the center:
	st.s = sc;
	st.t = tc;

	// if s or t end up outside the range [0.,1.], paint the pixel black:
	if( any( lessThan(st, vec2(0.0, 0.0)) ) )
	{
		gl_FragColor = BLACK;
	}
	else
	{
		if( any( greaterThan(st, vec2(1.0, 1.0)) ) )
		{
			gl_FragColor = BLACK;
		}
		else
		{
			//sampling the textures
			vec3 rgb1 = texture2D( uHorsePic, st ).rgb;
			vec3 rgb2=texture2D(uDogPic,st).rgb;
			vec3 blendTex=mix(rgb1,rgb2,uBlend);
			gl_FragColor = vec4( blendTex, 1. );
		}
	}


}

