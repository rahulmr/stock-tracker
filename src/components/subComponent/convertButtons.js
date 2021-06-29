const ConvertDataButtons = () => {


    var _fields = ['variety', 'exchange', 'tradingsymbol', 'transaction_type', 'quantity', 'order_type', 'price', 'trigger_price', 'product', 'validity', 'readonly', 'tag', 'stoploss', 'squareoff', 'trailing_stoploss', 'disclosed_quantity'];
    var elems = document.querySelector('*[data-kite]');
    // var elems = Array.apply(null, document.querySelectorAll('*[data-kite]'));
    elems.each((i, e) => {
        e = document.querySelector(e);

        if(e.data('kite-converted')) {
            return;
        }
        e.data('kite-converted', 1);

        // Get the data attribute params.
        var api_key = e.data('kite'), params = {'variety': 'regular'};
        for(var n=0; n<_fields.length; n++) {
            params[_fields[n]] = e.data(_fields[n]);
        }

        if(api_key && params.exchange && params.tradingsymbol && params.quantity && params.transaction_type) {
            let ki = new window.KiteConnect(api_key);
            ki.add(params);
            ki.link(e);

            if(e.prop('tagName').toUpperCase() == 'KITE-BUTTON') {
                e.addClass('kite-' + params.transaction_type.toLowerCase());
                e.attr('title', params.transaction_type + ' ' + params.tradingsymbol);
            }
        }
    });
}


export default ConvertDataButtons;