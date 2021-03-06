function autocomplete(elem, url, options) {
    var _this = this;

    this.elem = elem;
    this.currentValue = '';
    this.data = {
        text: ""
    };
    var atts = {
        "onSuccess": null,
        "onError": null,
        "onSelect": null,
        "onChange": null,
        "onDelete": null,
        "onHighlight": null,
        "multiSelect": false,
        "minChars": 3
    };
    var awesompleteOptions = {
        minChars: 1,
        autoFirst: true
    };

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

        // awesomplete options
        if ("awesomplete" in options) {
            for (var i in options.awesomplete) {
                awesompleteOptions[i] = options.awesomplete[i];
            }
        }
    }

    for (var att in atts) {
        this[att] = options && att in options? options[att] : atts[att];
    }

    this.awesomplete = new Awesomplete(elem, awesompleteOptions);

    switch (typeof(url)) {
        case "string":
            // key listener
            $(elem).on("keyup", function(event) {
                if ($.inArray(event.keyCode, [37, 38, 39, 40]) == -1) {
                    var text = $(this).val().trim();
                    if (text.length < _this.minChars) {
                        return;
                    }

                    _this.data.text = text;

                    $.ajax({
                        url: url,
                        type: "GET",
                        dataType: "json",
                        data: _this.data,
                        success: function (result) {
                            if (typeof(_this.onSuccess) == "function") {
                                _this.awesomplete.list = _this.onSuccess(result);
                            }
                        },
                        error: function () {
                            if (typeof(_this.onError) == "function") {
                                _this.onError();
                            }
                        }
                    });
                }
            });
            break;

        case "object":
            _this.awesomplete.list = url;
            break;
    }

    if (typeof(this.onChange) == "function") {
        $(this.elem).on("keyup", function() {
            var text = $(this).val().trim();
            if(_this.currentValue !== text) {
                _this.onChange();
            }
            _this.currentValue = text;
        });
    }
    
    if (typeof(this.onDelete) == "function") {
        $(this.elem).on("keyup", function() {
            var text = $(this).val().trim();
            if (text.length == 0) {
                _this.onDelete();
            }
        });
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

    // when item is highlighted
    if (typeof(this.onHighlight) == "function") {
        window.addEventListener("awesomplete-highlight", function(e) {
            var target = e.target;
            if (target === _this.elem) {
                _this.onHighlight(e);
            }
        }, false);
    }
}
