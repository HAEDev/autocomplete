function autocomplete(elem, url, options) {
    var _this = this;

    this.elem = elem;
    this.data = {
        text: ""
    };
    var atts = ["onSuccess", "onError", "onSelect", "multiSelect"];

    // parse options
    if (options) {
        // extra data
        if ("data" in options) {
            for (var i in options.data) {
                if (!(i in this.data)) {
                    this.data[i] = options.data[i];
                }
            }
        }
    }
    
    for (var i=0, n=atts.length; i<n; i++) {
        var att = atts[i];
        this[att] = options && att in options? options[att] : null;
    }
    
    this.awesomplete = new Awesomplete(elem, {
        minChars: 1,
        autoFirst: true
    });

    switch (typeof(url)) {
        case "string":
            // key listener
            $(elem).on("keyup", function() {
                var text = $(this).val();
                if (text.length < 3) {
                    return;
                }

                _this.data.text = text;

                $.ajax({
                    url: url,
                    type: "GET",
                    dataType: "json",
                    data: _this.data,
                    success: function(result) {
                        if (typeof(_this.onSuccess) == "function") {
                            _this.awesomplete.list = _this.onSuccess(result);
                        }
                    },
                    error: function() {
                        if (typeof(_this.onError) == "function") {
                            _this.onError();
                        }
                    }
                });
            });
            break;

        case "object":
            _this.awesomplete.list = url;
            break;
    }
    
    // when item is selected
    if (typeof(this.onSelect) == "function") {
        window.addEventListener("awesomplete-selectcomplete", function(e) {
            var target = e.target;
            if (target === _this.elem) {
                if (_this.multiSelect) {
                    $(_this.elem).val("");
                }
                _this.onSelect(e);
            }
        }, false);
    }
}