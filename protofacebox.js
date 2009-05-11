var ProtoFacebox = Class.create({
	initialize: function(options) {
		var defaults = {
			opacity      : 0,
			overlay      : false,
			loadingImage : 'file:///Users/sakkaoui/Documents/code/facebox/loading.gif',
			closeImage   : 'file:///Users/sakkaoui/Documents/code/facebox/closelabel.gif',
			imageTypes   : [ 'png', 'jpg', 'jpeg', 'gif' ],
			faceboxHtml  : '\
    <div id="protofacebox" style="display:none;"> \
      <div class="popup"> \
        <table id="protofacebox_table"> \
          <tbody> \
            <tr> \
              <td class="tl"/><td class="b"/><td class="tr"/> \
            </tr> \
            <tr> \
              <td class="b"/> \
              <td id="protofacebox_body"> \
                <div id="protofacebox_content"> \
                </div> \
                <div class="footer"> \
                  <a href="#" id="protofacebox_close"> \
                    <img src="/facebox/closelabel.gif" title="close" id="protofacebox_close_image" /> \
                  </a> \
                </div> \
              </td> \
              <td class="b"/> \
            </tr> \
            <tr> \
              <td class="bl"/><td class="b"/><td class="br"/> \
            </tr> \
          </tbody> \
        </table> \
      </div> \
    </div>'
		};
		console.log(options);
		this.settings = Object.extend(defaults, options || {});
		console.log(this.settings.class);
		this.init();
		
		if (this.settings) {
			this.loading();
			if (this.settings.ajax) this.fillFaceboxFromAjax(this.settings.ajax);
		    else if (this.settings.image) this.fillFaceboxFromImage(this.settings.image);
		    else if (this.settings.callback && Object.isFunction(this.settings.callback)) this.settings.callback.call(this);
		    else if (this.settings.div) this.reveal($(this.settings.div));
		    else if (this.settings.markup) this.reveal(this.settings.markup);
			else console.log("Data type unknown. Can't display anything");
		}
	},

	loading: function() {
		if ($('protofacebox_loading') != null) return true;
		this.showOverlay();
		
		$('protofacebox_content').update();
		$('protofacebox_body').insert('<div id="protofacebox_loading"><img src="' + this.settings.loadingImage + '" /></div>');

		var top = getPageScroll()[1] + (getPageHeight() / 10);
		var left = document.width / 2 - 205;
		$('protofacebox').setStyle({
			'top':	top + 'px',
			'left':	left + 'px'
		}).show();
		
		// $(document).bind('keydown.facebox', function(e) {
		// 	if (e.keyCode == 27) $.facebox.close()
		// 	return true
		// })
		$(document).fire('ProtoFacebox:loading');
	},
	
	reveal: function(data) {
		$(document).fire('ProtoFacebox:beforeReveal');
		if (this.settings.class) $('protofacebox_content').addClassName(this.settings.class);
		$('protofacebox_content').insert(data);
		if ($('protofacebox_loading')) $('protofacebox_loading').remove();
		$('protofacebox_body').appear();
		$('protofacebox').setStyle({left: document.width / 2 - ($('protofacebox_table').getDimensions().width / 2)});
		$(document).fire('ProtoFacebox:reveal')
		$(document).fire('ProtoFacebox:afterReveal');
	},
	
	close: function() {
		// $(document).unbind('keydown.facebox')
	    $('protofacebox').fade();
     	this.hideOverlay();
		if ($('protofacebox_loading') != null) $('protofacebox_loading').remove();
		if (this.settings.class) $('protofacebox_content').removeClassName(this.settings.class);
		
		$(document).fire('ProtoFacebox:close');
      	return false;
	},
	
	init: function(settings) {
		if (this.settings.inited) return true;
    	else this.settings.inited = true;

    	$(document).fire('ProtoFacebox:init');

    	var imageTypes = this.settings.imageTypes.join('|');
    	this.settings.imageTypesRegexp = new RegExp('\.(' + imageTypes + ')$', 'i');

    	if (settings) 
			extend(this.settings, settings);
   		$$('body')[0].insert(this.settings.faceboxHtml);

    	var preload = [ new Image(), new Image() ];
    	preload[0].src = this.settings.closeImage;
    	preload[1].src = this.settings.loadingImage;

    	$$('#protofacebox .b:first', '#protofacebox .bl', '#protofacebox .br', '#protofacebox .tl', '#protofacebox .tr').each(function(e) {
      		preload.push(new Image());
      		preload.slice(-1).src = e.getStyle('background-image').replace(/url\((.+)\)/, '$1');
    	})

    	$('protofacebox_close').observe('click', this.close.bind(this));
    	$('protofacebox_close_image').setAttribute('src', this.settings.closeImage);
  	},

  	skipOverlay: function() {
    	return this.settings.overlay == false || this.settings.opacity === null
  	},

  	showOverlay: function() {
    	if (this.skipOverlay()) return;

    	if ($('protofacebox_overlay') == null)
      		$$("body")[0].insert('<div id="protofacebox_overlay" class="protofacebox_hide"></div>');

		$('protofacebox_overlay').hide();
    	$('protofacebox_overlay').addClassName("protofacebox_overlayBG")
			.setOpacity(0.5)
			.observe('click', function() { $(document).fire('ProtoFacebox:close') })
			.appear({to: this.settings.opacity, duration: 5});
    	return false;
	},
	
	hideOverlay: function() {
		if (this.skipOverlay()) return;

    	$('protofacebox_overlay').fade({duration: 0.2});
   		$("protofacebox_overlay").removeClassName("protofacebox_overlayBG");
   		$("protofacebox_overlay").addClassName("protofacebox_hide");
   		$("protofacebox_overlay").remove();

    	return false;
  	},

  	fillFaceboxFromAjax: function(url) {
		new Ajax.Request(url, {
		  method: 'get',
		  onSuccess: function(transport) {
			this.reveal(transport.responseText);
		  }.bind(this)
		});
  	},

  	fillFaceboxFromImage: function(href) {
    	var image = new Image();
		
		var f = function() {
      		this.reveal('<div class="image"><img src="' + image.src + '" /></div>');
    	}

    	image.onload = f.bind(this)
    	image.src = href;
  	}
});


// getPageScroll() by quirksmode.com
function getPageScroll() {
  	var xScroll, yScroll;

  	if (self.pageYOffset) {
    	yScroll = self.pageYOffset;
    	xScroll = self.pageXOffset;
	} else if (document.documentElement && document.documentElement.scrollTop) {	 // Explorer 6 Strict
    	yScroll = document.documentElement.scrollTop;
    	xScroll = document.documentElement.scrollLeft;
  	} else if (document.body) {// all other Explorers
		yScroll = document.body.scrollTop;
    	xScroll = document.body.scrollLeft;
  	}

  	return new Array(xScroll,yScroll);
}

// Adapted from getPageSize() by quirksmode.com
function getPageHeight() {
  	var windowHeight;

  	if (self.innerHeight) {	// all except Explorer
    	windowHeight = self.innerHeight;
  	} else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
    	windowHeight = document.documentElement.clientHeight;
  	} else if (document.body) { // other Explorers
    	windowHeight = document.body.clientHeight;
  	}

  	return windowHeight;
}
