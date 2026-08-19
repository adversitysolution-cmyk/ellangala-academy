(function ($) {
    "use strict";
    if ($(".dynamic-year").length) {
        let date = new Date();
        $(".dynamic-year").html(date.getFullYear());
    }

    if ($(".demos-one__item a").length) {
        $(".demos-one__item a").each(function () {
            let self = $(this);
            self.attr("target", "_blank");
        });
    }

    if ($(".wow").length) {
        var wow = new WOW({
            boxClass: "wow", // animated element css class (default is wow)
            animateClass: "animated", // animation css class (default is animated)
            mobile: true, // trigger animations on mobile devices (default is true)
            live: true, // act on asynchronously loaded content (default is true)
        });
        wow.init();
    }
})(jQuery);
