$(document).ready(function() {
    $('#listContainer').append('<p id="info"></p><ul id="list"></ul>');
    var categories = [];
    var products = [];
    $.ajax({
        type: 'GET',
        url: 'xml/Categories.xml',
        dataType: 'xml',
        success: function(data) {
            $(data).find('Categories').each(function() {
                    if ($(this).children().length) {
                        var categoryID = $(this).find('CategoryID').text();
                        var categoryName = $(this).find('CategoryName').text();
                        var description = $(this).find('Description').text();
                        var category = new Array();
                        category.push(categoryID);
                        category.push(categoryName);
                        category.push(description);
                        categories.push(category);
                    }
                })
        },
        error: function() {
            console.log('Error Found in Categories XML file.');
        }
    }).done(function() {
        Products();
    });
    var Products = function() {
            $.ajax({
                type: 'GET',
                url: 'xml/Products.xml',
                dataType: 'xml',
                success: function(data) {
                    $(data).find('Products').each(function() {
                        if ($(this).children().length) {
                            var productID = $(this).find('ProductID').text();
                            var productName = $(this).find('ProductName').text();
                            var categoryID = $(this).find('CategoryID').text();
                            var qtyPerUnit = $(this).find('QuantityPerUnit').text();
                            var unitPrice = $(this).find('UnitPrice').text();
                            var product = new Array();
                            product.push(productID);
                            product.push(productName);
                            product.push(categoryID);
                            product.push(qtyPerUnit);
                            product.push(unitPrice);
                            products.push(product);
                        }
                    });
                },
                error: function() {
                    console.log('Error Found in Products XML file.');
                }
            }).done(function() {
                for (var i = 0; i < categories.length; i++) {
                    if (categories[i][0] != "") {
                        $('#list').append("<li id='" + categories[i][0] + "'><a href='#' id='" + categories[i][0] + "' class='getCategory' data-name='" + categories[i][1] + "' data-desc='" + categories[i][2] + "'>" + categories[i][1] + "</a></li>");
                        for (var j = 0; j < products.length; j++) {
                            if (categories[i][0] == products[j][2]) {
                                var cgListID = document.getElementById(categories[i][0]);
                                var subList = document.getElementById('sub_' + categories[i][0]);
                                if (subList == null) {
                                    $('<ul id="productUnder_' + categories[i][0] + '"></ul>').appendTo(cgListID);
                                    var html = '<a href="#' + products[j][1] + '" class="getProduct" data-name="' + products[j][1] + '" data-qty="' + products[j][3] + '" data-price="' + products[j][4] + '">' + products[j][1] + '</a>';
                                    $('<li></li>').html(html).appendTo('#productUnder_' + categories[i][0]);
                                } else {
                                    $('<li></li>').html(html).appendTo(subList);
                                }
                            }
                        }
                    }
                }
                $(".getCategory").click(function() {
                    $("#info").removeClass("active yellow").html("");
                    var cDesc = $(this).data('desc');
                    var cName = $(this).data('name');
                    $("#info").addClass("active").html("Category ID : " + $(this).attr('id') + "<br />Name : " + cName + "<br />Description : " + cDesc);
                });
                $(".getProduct").click(function() {
                    $("#info").removeClass("active yellow").html("");
                    var pDesc = $(this).data('desc');
                    var pName = $(this).data('name');
                    var pQty = $(this).data('qty');
                    var pPrice = $(this).data('price');
                    $("#info").addClass("active yellow").html("Product Name : " + pName + "<br />Qty : " + pQty + "<br />Price : " + pPrice);
                });
                var $originalList = $('#listContainer').children('ul').clone();
                $('#listContainer2').html($originalList);
                $('#listContainer2').jstree({
                    "core": {
                        "themes": {
                            "variant": "medium"
                        }
                    },
                    "checkbox": {
                        "keep_selected_style": false
                    }
                }).bind("select_node.jstree", function(e, data) {
                    $("#dialogHolder").dialog({
                        autoOpen: false
                    });
                    var level = data.node.parents.length;
                    if (level == 1) {
                        for (var i = 0; i < categories.length; i++) {
                            if (data.node.id == categories[i][0])

                                $("#dialogHolder").html("<h4>Category Info:</h4>Name: <b>" + categories[i][1] + "</b><br />Description: <b>" + categories[i][2] +"</b>").dialog('open');
                        }
                    } else {
                        for (var j = 0; j < products.length; j++) {
                            var href = data.node.a_attr.href;
                            href = href.replace("#", "");
                            if (href == products[j][1])
                                $("#dialogHolder").html("<h4>Product Info:</h4>Name: <b>" + products[j][1] + "</b><br />Qty: <b>" + products[j][3] + "</b><br />Price: <b>" + products[j][4] + "</b>").dialog('open');
                        }
                    }
                }).on('ready.jstree', function() {
                    $('#listContainer2').jstree("open_all");
                });
            }); //end done
        } //end Products 
});