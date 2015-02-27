define([
      "dojo/_base/declare",
      "dojo/dom-construct"
    ], function(
      declare,
      domConstruct
    ) {
		
        var variableName = ['Expression_A', 'Expression_B', 'Expression_C', 'Expression_D', 'Expression_E', 'Expression_F', 'Expression_G', 'Expression_H'];

        var html = "<div id='exprbuilder-select-expression-div' class='expressionBuilder'></div>"
            + "<label for='exprbuilder-expression-text'>Expression:</label>"
            + "<textarea id='exprbuilder-expression-text' readonly='readonly' class='expressionBuilder'></textarea>"
            + "<span style='float:right'>"
            + "<input type='button' id='exprbuilder-add-button' value='Add Expression'/>"
            + "</span>"
            + "<div id='exprbuilder-add-div' style='display:none' class='expressionBuilder-customExpression'></div>";


	return declare(null,{
	    constructor: function (_rasters, _popupDivId, _callback) {

	        domConstruct.create("div", { id: "exprbuilder-parent" }, _popupDivId);

	        this.variableIdx = 0;

	        //var exprCalc = $("#" + _popupDivId);
	        var exprCalc = $("#exprbuilder-parent");
	        exprCalc.empty();
	        exprCalc.prop("title", "Expression Chooser");
	        exprCalc.html(html);

            //setup (but do not populate) expression chooser list of all expressions
	        var mainExprBox = $("<select></select>").attr("id", "exprbuilder-select-expression-select").attr("size", 3);
	        mainExprBox.change(function () {
	            var exprtext = expressionToString($(this).find(":selected").data("expr"));
	            $("#exprbuilder-expression-text").val(exprtext);
	        });
	        $("#exprbuilder-select-expression-div").append(mainExprBox);

            
	        //expression calculator setup
	        $("#exprbuilder-add-div").prop("title", "Add Custom Expression");

	        //expression calculator expression name
	        var exprNameAreaLabel = $("<label >", { text: 'Expression name: ' + variableName[this.variableIdx] })
	        $("#exprbuilder-add-div").append(exprNameAreaLabel);

	        //expression calculator
	        var exprDiv = $("<div />");
	        $("#exprbuilder-add-div").append(exprDiv);

	        //expression calculator left expression
	        var leftExprBox = $("<select></select>").attr("id", "exprbuilder-select-expression-add-left-expr");
	        leftExprBox.change(onCurrentExpressionChange);
            exprDiv.append(leftExprBox);

            //expression calculator operator
	        var exprSpan = $("<span />");
	        exprDiv.append(exprSpan);

	        var exprRadioAdd = $("<input />", { 'type': 'radio', name: 'exprbuilder-expr-radio', id: 'exprbuilder-select-expression-add-sum', value: 'ADD' }).change(onCurrentExpressionChange);
	        var exprRadioAddLabel = $("<label for='exprbuilder-select-expression-add-sum'>+</label>");
	        exprSpan.append(exprRadioAdd).append(exprRadioAddLabel);

	        var exprRadioSubtract = $("<input />", { 'type': 'radio', name: 'exprbuilder-expr-radio', id: 'exprbuilder-select-expression-add-subtract', value: 'SUBTRACT' }).change(onCurrentExpressionChange);
	        var exprRadioSubtractLabel = $("<label for='exprbuilder-select-expression-add-subtract'>-</label>");
	        exprSpan.append(exprRadioSubtract).append(exprRadioSubtractLabel);

	        var exprRadioMult = $("<input />", { 'type': 'radio', name: 'exprbuilder-expr-radio', id: 'exprbuilder-select-expression-add-mult', value: 'MULTIPLY' }).change(onCurrentExpressionChange);
	        var exprRadioMultLabel = $("<label for='exprbuilder-select-expression-add-mult'>*</label>");
	        exprSpan.append(exprRadioMult).append(exprRadioMultLabel);

	        var exprRadioDivide = $("<input />", { 'type': 'radio', name: 'exprbuilder-expr-radio', id: 'exprbuilder-select-expression-add-divide', value: 'DIVIDE' }).change(onCurrentExpressionChange);
	        var exprRadioDivideLabel = $("<label for='exprbuilder-select-expression-add-divide'>/</label>");
	        exprSpan.append(exprRadioDivide).append(exprRadioDivideLabel);
	        exprSpan.buttonset();
	        
            //expression calculator right expression
	        var rightExprBox = $("<select></select>").attr("id", "exprbuilder-select-expression-add-right-expr");
	        rightExprBox.change(onCurrentExpressionChange);
	        exprDiv.append(rightExprBox);

            //expression calculator constant input
	        var constantInput = $("<input/>").attr({ type: 'number' }).change(onCurrentExpressionChange);
            constantInput.hide();
	        exprDiv.append(constantInput);

	        //expression calculator current expression
	        var currExprText = $("<textarea />", { 'readonly': 'readonly' });
	        $("#exprbuilder-add-div").append(currExprText);
	        function onCurrentExpressionChange() {
	            var op = $('input:radio[name=exprbuilder-expr-radio]:checked', '#exprbuilder-add-div').val();
	            var rightSelected = rightExprBox.find(":selected");
	            if (rightSelected.val() == -1) {
	                constantInput.show();
	                currExprText.val("("
                        + expressionToString(leftExprBox.find(":selected").data("expr"))
                        + " " + operatorToString(op) + " "
                        + constantInput.val() + ")");
	            } else {
	                constantInput.hide();
	                currExprText.val("("
                        + expressionToString(leftExprBox.find(":selected").data("expr"))
                        + " " + operatorToString(op) + " "
                        + expressionToString(rightExprBox.find(":selected").data("expr")) + ")");
	            }
	        }
            
	        $("#exprbuilder-add-button").button().click(function () {
	            $("#exprbuilder-add-div").dialog("open");
	        });

            //add expressions to select boxes
	        var rasterList = [];
	        $.each(_rasters, function (rname, obj) {
	            var rasterObj = { "title": obj.title, "value_raster": rname };
	            rasterList.push(rasterObj);
	        });
	        getExpressionOptions(rasterList, []);

	        this.rasters = rasterList;
	        this.expressions = [];
	        //this.divId = _popupDivId;
            
            var self = this;
	        exprCalc.dialog({
	            autoOpen: false,
	            width: 500,
	            modal: true,
	            dialogClass: 'dialogClass',
	            buttons: {
	                "Choose": function () {
	                    var expression = $("#exprbuilder-select-expression-select").find(":selected").data("expr")
	                    if (typeof expression != "undefined") {
	                        _callback(expression);
	                        $(this).dialog("close");
	                    } else {
	                        alert("Please select an expression.");
	                    }
	                    
	                },
	                Cancel: function () {
	                    $(this).dialog("close");
	                }
	            }
	        });

	        $("#exprbuilder-add-div").dialog({
	            autoOpen: false,
	            width: 550,
	            modal: true,
	            dialogClass: 'dialogClass',
	            buttons: {
	                "Add": function () {
	                    var op = $('input:radio[name=exprbuilder-expr-radio]:checked', '#exprbuilder-add-div').val();
	                    if (typeof op == 'undefined') {
	                        alert("Please choose an operation");
	                    } else {
	                        var rightSelectedVal;
	                        if (rightExprBox.find(":selected").val() == -1) {
	                            rightSelectedVal = { value: constantInput.val() };
	                            console.log("CONSTANT " + rightSelectedVal);
	                        } else {
	                            rightSelectedVal = rightExprBox.find(":selected").data("expr");
	                        }
	                        var expressionObj = {
	                            "title": variableName[self.variableIdx],
	                            "left": leftExprBox.find(":selected").data("expr"),
	                            "right": rightSelectedVal,
	                            "operator": op
	                        };
	                        self.expressions.unshift(expressionObj);
	                        getExpressionOptions(self.rasters, self.expressions);
	                        $(this).dialog("close");
	                        self.variableIdx = self.variableIdx + 1;
	                        exprNameAreaLabel.text('Expression name: ' + variableName[self.variableIdx]);
	                        currExprText.val("");
	                    }
	                },
	                Cancel: function () {
	                    $(this).dialog("close");
	                }
	            }
	        });
	    },

	    createExpression: function () {
	        $("#exprbuilder-parent").dialog("open");
	        $("#exprbuilder-add-div").dialog("open");
	    },

	    clear: function () {
	        this.rasters = [];
	        this.expressions = [];
	        this.variableIdx = 0;
	        domConstruct.destroy("exprbuilder-parent");
	        domConstruct.destroy("exprbuilder-add-div");
	    }
	});

	function expressionToString(expr) {
	    console.log(expr);
	    if (typeof expr.value_raster != 'undefined') {
	        return '"' + expr.title + '"';
	    } else if (typeof expr.value != 'undefined') {
	        return expr.value;
	    } else {
	        var opText = operatorToString(expr.operator);
	        return "(" + expressionToString(expr.left) + " " + opText + " " + expressionToString(expr.right) + ")";
	    }    
	}

	function operatorToString(operator) {
	    switch (operator) {
	        case "ADD":
	            return "+";
	        case "SUBTRACT":
	            return "-";
	        case "MULTIPLY":
	            return "*";
	        case "DIVIDE":
	            return "/";
	        default:
	            return "OPERATOR";
	    }
	}

	function getExpressionOptions(rasterList, exprList) {
	    var opts_main = [];
	    var opts_left = [];
	    var opts_right = [];
	    $.each(rasterList, function (idx, obj) {
	        opt = $("<option/>").text(obj.title).data("expr", obj);
	        opts_left.push(opt);
	        opt = $("<option/>").text(obj.title).data("expr", obj);
	        opts_right.push(opt);
	    });
	    $.each(exprList, function (idx, obj) {
	        var opt = $("<option/>").text(obj.title).data("expr", obj);
	        opts_main.push(opt);
	        opt = $("<option/>").text(obj.title).data("expr", obj);
	        opts_left.push(opt);
	        opt = $("<option/>").text(obj.title).data("expr", obj);
	        opts_right.push(opt);
	    });

	    $("#exprbuilder-select-expression-select").empty();
	    $("#exprbuilder-select-expression-select").append(opts_main);

	    $("#exprbuilder-select-expression-add-left-expr").empty();
	    $("#exprbuilder-select-expression-add-left-expr").append(opts_left);

	    $("#exprbuilder-select-expression-add-right-expr").empty();
	    $("#exprbuilder-select-expression-add-right-expr").append(opts_right);
	    var valueOpt = $("<option/>").attr("value", -1).text("Choose constant");
	    $("#exprbuilder-select-expression-add-right-expr").append(valueOpt);
	}
});

