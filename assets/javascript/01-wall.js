
var counterFluid=1
function photos_wall(result){
	var maxLength=result.img.length
    var mywall = new Wall("wall", {
		"draggable":true,
		"width":180,
		"height":180,
		"printCoordinates":false,
		"rangex":[-300,300],
		"rangey":[-300,300],
		callOnUpdate: function(items){
			items.each(function(e, i){
				var a = new Element("img[src="+result.img[counterFluid]+"]", {
						styles: {
							width: '100%',
							height: '100%'
						}
					});
				a.set("title",result.title[counterFluid]);
				a.set("longdesc",result.url[counterFluid++])
				a.addEvent("click", function(e){
					if( mywall.getMovement() ){

					}else{
						new Element('div', {class:"magnify",html: '<div class="large"></div><img class="small" src="'+e.target.src+'"/><div id="vermas"><a target="blank" href="'+e.target.longDesc+'"> Ver mas</a></div>'}).MooDialog();
						var imagen=$(".small")
						$(".large").css("background",'url('+e.target.src+') no-repeat')
						margin= (screen.width-imagen[0].width-30)/2;
						$(".MooDialog").css("margin-left",margin).css("width",imagen[0].width)
						$(".MooDialog .close").css("left",imagen[0].width+40)
						lupa()
					}

				})
				a.inject(e.node).fade("hide").fade("in");
				if( counterFluid > maxLength ) counterFluid = 1;
			}.bind(this));
		}
    });
    // Init Wall
	mywall.initWall();
};
function lupa(){
	var native_width = 0;
	var native_height = 0;

	//Now the mousemove function
	$(".magnify").mousemove(function(e){
		//When the user hovers on the image, the script will first calculate
		//the native dimensions if they don't exist. Only after the native dimensions
		//are available, the script will show the zoomed version.
		if(!native_width && !native_height)
		{
			//This will create a new image object with the same image as that in .small
			//We cannot directly get the dimensions from .small because of the
			//width specified to 200px in the html. To get the actual dimensions we have
			//created this image object.
			var image_object = new Image();
			image_object.src = $(".small").attr("src");

			//This code is wrapped in the .load function which is important.
			//width and height of the object would return 0 if accessed before
			//the image gets loaded.
			native_width = image_object.width;
			native_height = image_object.height;
		}
		else
		{
			//x/y coordinates of the mouse
			//This is the position of .magnify with respect to the document.
			var magnify_offset = $(this).offset();
			//We will deduct the positions of .magnify from the mouse positions with
			//respect to the document to get the mouse positions with respect to the
			//container(.magnify)
			var mx = e.pageX - magnify_offset.left;
			var my = e.pageY - magnify_offset.top;

			//Finally the code to fade out the glass if the mouse is outside the container
			if(mx < $(this).width() && my < $(this).height() && mx > 0 && my > 0)
			{
				$(".large").fadeIn(100);
			}
			else
			{
				$(".large").fadeOut(100);
			}
			if($(".large").is(":visible"))
			{
				//The background position of .large will be changed according to the position
				//of the mouse over the .small image. So we will get the ratio of the pixel
				//under the mouse pointer with respect to the image and use that to position the
				//large image inside the magnifying glass
				var rx = Math.round(mx/$(".small").width()*native_width - $(".large").width()/2)*-1;
				var ry = Math.round(my/$(".small").height()*native_height - $(".large").height()/2)*-1;
				var bgp = rx + "px " + ry + "px";

				//Time to move the magnifying glass with the mouse
				var px = mx - $(".large").width()/2;
				var py = my - $(".large").height()/2;
				//Now the glass moves with the mouse
				//The logic is to deduct half of the glass's width and height from the
				//mouse coordinates to place it with its center at the mouse coordinates

				//If you hover on the image now, you should see the magnifying glass in action
				$(".large").css({left: px, top: py, backgroundPosition: bgp});
			}
		}
	})
}
function loadGsa(q, num_elem, field, cliente, site) {
    $.gsa({
        GSA_query: q,
        GSA_num: num_elem,
        GSA_client: cliente,
        GSA_site: site,
        GSA_callback: true,
        GSA_partialfields: field
                //,GSA_debug:1
    }, function(data) {
        if (data.RES) {
            var params = $.gsa.params(data.PARAM);
            var realResults = data.RES["@attributes"].EN;
            var results = $.gsa.results(data);
			//| results[key].T.search("Alejandro Sanz... ¡Y sus mujeres!")==-1 | results[key].T.search("¡Luis Miguel y Kasia disfrutan un día en su yate!")==-1
			var imgs=new Array(),titles=new Array(),urls=new Array();
			$.each(results, function(key, metadata) {
				if(results[key].T.search( "Famosos supersticiosos y sus rituales")==-1 ){
					for(var i=1;i<20;i++){
						if(typeof results[key]["foto"+i] !="undefined"){
							imgs.push(results[key]["foto"+i])
							titles.push(results[key]["T"])
							urls.push(results[key]["URL"])
						}
						else
							break;
					}
				}
            });
			result={"img":imgs,"title":titles,"url":urls}
			photos_wall(result);
        }
    });
}


 loadGsa("site:http://espectaculos.televisa.com/farandula/fotos", "50", "tipo:galeria", "portal", "portal");


//estilovida_tvsa


/*
var searchs={
	'todas':'http://estilodevida.televisa.com','pareja':'http://estilodevida.televisa.com/pareja'
	,'salud':'http://estilodevida.televisa.com/salud','estilo':'http://estilodevida.televisa.com/estilo'
	,'maternidad':'http://estilodevida.televisa.com/maternidad','hombre':'http://estilodevida.televisa.com/hombre',
	'tendencias':'http://estilodevida.televisa.com/tendencias','hogar':'http://estilodevida.televisa.com/hogar'
}
t,otalResults=0,
categoryName='',
selectClass='',
channelMetrics='',
pathChannel=window.location.pathname;



/*

function mosaicGSA(seccion){
	consulta=searchs[seccion];

	$.fn.mosaicCategoryGSA = function(options){
		var settings=$.extend({ 'cliente':'estilovida_tvsa','site':'estilovida_tvsa','query':consulta,'media':'galeria'},options);
		var gsaItems ={_exect:function(){
		$.gsa({
			GSA_domain:"http://googleak.esmas.com/search",
			GSA_query:"site:"+settings.query
			,GSA_num:9
			,GSA_client:settings.cliente
			,GSA_site:settings.site
			,GSA_requiredfields:"tipo:"+settings.media
			,GSA_sort:"meta:creationDate:D:ED",
		},function(data){
			if(data.RES){
			}
*/