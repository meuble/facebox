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
		}
	},

	loading: function() {
		init();
		if ($$('#facebox .loading')[0].length == 1) return true;
		showOverlay();

		$$('#facebox .content')[0].empty();
		$('#facebox .body')[0].hide().uptdate('<div class="loading"><img src="' + this.settings.loadingImage + '"/></div>');

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
		$$('#facebox .loading')[0].remove();
		$('#facebox .body')[0].show();
		$$('#facebox').setStyle({left: $(window).width() / 2 - ($$('#facebox table')[0].width() / 2)});
		$(document).fire('ProtoFacebox:reveal')
		$(document).fire('ProtoFacebox:afterReveal');
	},
	
	close: function() {},
	
	init: function(settings) {
		if ($.facebox.settings.inited) return true
    else $.facebox.settings.inited = true

    $(document).trigger('init.facebox')
    makeCompatible()

    var imageTypes = $.facebox.settings.imageTypes.join('|')
    $.facebox.settings.imageTypesRegexp = new RegExp('\.(' + imageTypes + ')$', 'i')

    if (settings) $.extend($.facebox.settings, settings)
    $('body').append($.facebox.settings.faceboxHtml)

    var preload = [ new Image(), new Image() ]
    preload[0].src = $.facebox.settings.closeImage
    preload[1].src = $.facebox.settings.loadingImage

    $('#facebox').find('.b:first, .bl, .br, .tl, .tr').each(function() {
      preload.push(new Image())
      preload.slice(-1).src = $(this).css('background-image').replace(/url\((.+)\)/, '$1')
    })

    $('#facebox .close').click($.facebox.close)
    $('#facebox .close_image').attr('src', $.facebox.settings.closeImage)
  }
  
});