$(function() {
    SyntaxHighlighter.defaults.gutter = false;
    SyntaxHighlighter.all();
    
    if($.fn.slippy) {
        $(".slide").slippy();
    };

    if($.fn.noisy) {
        $("body").noisy({
            monochrome: true,
            opacity: 0.06,
            intensity: 10
        });
    };
}());
