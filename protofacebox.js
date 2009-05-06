var ProtoFacebox = Class.create({
	initialize: function(expression) {
		this.settings = {
			opacity      : 0,
			overlay      : true,
			loadingImage : '/facebox/loading.gif',
			closeImage   : '/facebox/closelabel.gif',
			imageTypes   : [ 'png', 'jpg', 'jpeg', 'gif' ],
			faceboxHtml  : '\
    <div id="facebox" style="display:none;"> \
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
                  <a href="#" class="close"> \
                    <img src="/facebox/closelabel.gif" title="close" class="close_image" /> \
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
		// this.init();
		this.loading();
	},

	loading: function() {
		this.init();
		if ($('protofacebox_loading') != null) return true;
		this.showOverlay();

		$('protofacebox_content').empty();
		$('protofacebox_body').hide().insert('<div id="protofacebox_loading"><img src="' + this.settings.loadingImage + '"/></div>');

		$('facebox').setStyle({
			'top':	getPageScroll()[1] + (getPageHeight() / 10),
			'left':	document.width / 2 - 205
		}).show();

		// $(document).bind('keydown.facebox', function(e) {
		// 	if (e.keyCode == 27) $.facebox.close()
		// 	return true
		// })
		$(document).fire('ProtoFacebox:loading');
	},
	
	reveal: function(data, klass) {
		$(document).fire('ProtoFacebox:beforeReveal');
		if (klass) $('protofacebox_content').addClassName(klass);
		console.log(data);
		console.log($('protofacebox_content'));
		$('protofacebox_content').appendChild(data);
		$('protofacebox_loading').remove();
		$('protofacebox_body').appear();
		$('facebox').setStyle({left: document.width / 2 - ($('protofacebox_table').getDimensions().width / 2)});
		$(document).fire('ProtoFacebox:reveal')
		$(document).fire('ProtoFacebox:afterReveal');
	},
	
	close: function() {},
	
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

    	$$('#facebox .b:first', '#facebox .bl', '#facebox .br', '#facebox .tl', '#facebox .tr').each(function(e) {
      		preload.push(new Image());
      		preload.slice(-1).src = e.getStyle('background-image').replace(/url\((.+)\)/, '$1');
    	})

    	$$('#facebox .close')[0].observe('click', this.close.bind(this));
    	$$('#facebox .close_image')[0].setAttribute('src', this.settings.closeImage);
  	},

  	skipOverlay: function() {
    	return this.settings.overlay == false || this.settings.opacity === null
  	},

  	showOverlay: function() {
    	if (this.skipOverlay()) return;

    	if ($('facebox_overlay') == null)
      		$$("body")[0].insert('<div id="facebox_overlay" class="facebox_hide"></div>');

    	$('facebox_overlay').hide().addClassName("facebox_overlayBG")
      		.setOpacity(this.settings.opacity)
      		.observe('click', function() { $(document).fire('ProtoFacebox:close') })
      		.appear();
    	return false;
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
  return new Array(xScroll,yScroll)
}

// Adapted from getPageSize() by quirksmode.com
function getPageHeight() {
  var windowHeight
  if (self.innerHeight) {	// all except Explorer
    windowHeight = self.innerHeight;
  } else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
    windowHeight = document.documentElement.clientHeight;
  } else if (document.body) { // other Explorers
    windowHeight = document.body.clientHeight;
  }
  return windowHeight
}
