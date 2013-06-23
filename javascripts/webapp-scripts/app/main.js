require([
    'app/utility/totalsCalculator',
    'app/utility/csvParser',
    'mustache!packingRecord',
    'mustache!packingTotals',
    'mustache!alertMessage'
], function(
    totalsCalculator,
    csvParser,
    packingRecordTemplate,
    packingTotalsTemplate,
    alertMessageTemplate
){
    'use strict';

    // Check for the various File API support.
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
        return alert('The File APIs are not fully supported in this browser.');
    }

    function displayAlert(errorMessage){
        $('.notificationContainer .alert-error').remove();

        $('.notificationContainer').append(alertMessageTemplate({errorMessage: errorMessage}));
        return false;
    }


    function renderPackingSheet(records, totals){
        var $records = $('#records');

        $records.append('<h2>Customer Details for ' + records[0].deliveryRoute + '</h2>');

        _(records).each(function(record){
            $records.append(packingRecordTemplate(record));
        });

        $records.append(packingTotalsTemplate(totals));
    }

    function handleFileSelect(e) {
        var files = e.target.files; // FileList object

        // files is a FileList of File objects. List some properties.
        var output = [];

        _(files).each(function(f){
            output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
            f.size, ' bytes, last modified: ',
            f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                '</li>');

            var reader = new FileReader();

            reader.onload = (function(){
                return function(e){
                    if(!e || !e.target || !e.target.result){
                        return displayAlert('Could not find any data');
                    }
                    csvParser.parse(e.target.result, function(error, records){
                        if(error){
                            return displayAlert(error);
                        }
                        var packingTotals = totalsCalculator.calculateTotals(records);

                        renderPackingSheet(records, packingTotals);

                    });

                };
            })();

            reader.readAsText(f);
        });
        $('#fileDataList').html('<ul>' + output.join('') + '</ul>');
    }

    $('#files').on('change', handleFileSelect);

});

// http://jsbin.com/iyeqer/1/edit
// var css = novoForm.document.createElement("style");
// css.type = "text/css";
// css.innerHTML = ".strong { color: red }";
// novoForm.document.head.appendChild(css);
// novoForm.document.body.innerHTML = '<div class="strong">Hi there</div>';