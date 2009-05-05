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
        <table> \
          <tbody> \
            <tr> \
              <td class="tl"/><td class="b"/><td class="tr"/> \
            </tr> \
            <tr> \
              <td class="b"/> \
              <td class="body"> \
                <div class="content"> \
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

		$$('#facebox .content')[0].empty();
		$('#facebox .body')[0].hide().insert('<div id="protofacebox_loading"><img src="' + this.settings.loadingImage + '"/></div>');

		$('#facebox').setStyle({
			'top':	getPageScroll()[1] + (getPageHeight() / 10),
			'left':	$(window).width() / 2 - 205
		}).show();

		// $(document).bind('keydown.facebox', function(e) {
		// 	if (e.keyCode == 27) $.facebox.close()
		// 	return true
		// })
		$(document).fire('ProtoFacebox:loading');
	},
	
	reveal: function(data, klass) {
		$(document).fire('ProtoFacebox:beforeReveal');
		if (klass) $$('#facebox .content')[0].addClassName(klass);
		console.log(data);
		console.log($$('#facebox .content'));
		$$('#facebox .content')[0].appendChild(data);
		$('protofacebox_loading').remove();
		$$('#facebox .body')[0].show();
		$('facebox').setStyle({left: $(window).width() / 2 - ($$('#facebox table')[0].width() / 2)});
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
      		.setStyle('opacity', this.settings.opacity)
      		.observe('click', function() { $(document).fire('ProtoFacebox:close') })
      		.appear();
    	return false;
  }

  
});