require([
    'app/utility/totalsCalculator',
    'app/utility/csvParser',
    'libs/tabler/tabler',
    'mustache!packingRecord',
    'mustache!packingTotals',
    'mustache!alertMessage'
], function(
    totalsCalculator,
    csvParser,
    tabler,
    packingRecordTemplate,
    packingTotalsTemplate,
    alertMessageTemplate
){
    'use strict';

    var $results = $('#results');

    function displayAlert(errorMessage, fileName){
        $('.notificationContainer').append(alertMessageTemplate({
            fileName: fileName,
            errorMessage: errorMessage
        }));
    }

    // Check for the various File API support.
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
        displayAlert('This browser is not supported. Please use Google Chrome or Mozilla Firefox');
        return false;
    }

    function renderDeliverySheet(records){
        var table = tabler.create([
            {field: 'firstName', name: 'First Name'},
            {field: 'lastName', name: 'Last Name'},
            {field: 'customerNumber', name: 'Customer Number'},
            {field: 'address', name: 'Customer Number'}
        ]);

        table.load(records);
        table.render();

        $results.append('<h2>Delivery Sheet for ' + records[0].deliveryRoute + '</h2>');

        $results.append(table.$el);
    }

    function renderPackingSheet(rounds){
        _(rounds).each(function(records){
            $results.append('<div class="page-break"></div>');
            $results.append('<h2>Customer Details for ' + records[0].deliveryRoute + '</h2>');

            _(records).each(function(record){
                $results.append(packingRecordTemplate(record));
            });
        });
    }

    function renderTotals(totals){
        _(totals).each(function(roundTotals){
            var roundTotalsHTML = packingTotalsTemplate({
                heading: 'Round Totals for ' + roundTotals.deliveryRoute,
                boxes: totalsCalculator.formatTotals(roundTotals.boxTotals),
                extras: totalsCalculator.formatTotals(roundTotals.extraTotals)
            });

            $results.append(roundTotalsHTML);
        });
    }

    function renderGrandTotals(grandTotals){
        var grandTotalsHTML = packingTotalsTemplate({
            heading: 'Grand Totals',
            boxes: totalsCalculator.formatTotals(grandTotals.boxTotals),
            extras: totalsCalculator.formatTotals(grandTotals.extraTotals)
        });

        $results.append('<div class="page-break"></div>');
        $results.append(grandTotalsHTML);
    }

    function onAllRoundsLoaded(rounds){
        var totals = totalsCalculator.calculateTotals(rounds);

        renderDeliverySheet(rounds[0]);

        renderTotals(totals);

        if(rounds.length > 1){
            renderGrandTotals(totalsCalculator.calculateGrandTotals(totals));
        }

        renderPackingSheet(rounds);
    }

    function handleFileSelect(e) {
        var files = e.target.files;
        var numberOfFiles = files.length;
        var rounds = [];

        _(files).each(function(file){
            var reader = new FileReader();

            reader.onload = (function(file){

                return function(e){
                    var fileName = escape(file.name);

                    if(!e || !e.target || !e.target.result){
                        return displayAlert('Could not find any data', fileName);
                    }
                    csvParser.parse(e.target.result, function(error, records){
                        if(error){
                            return displayAlert(error, fileName);
                        }

                        rounds.push(records);

                        if(--numberOfFiles === 0){
                            onAllRoundsLoaded(rounds);
                        }

                    });
                };
            })(file);

            reader.readAsText(file);
        });

    }

    $('#files').on('change', handleFileSelect);

});

// http://jsbin.com/iyeqer/1/edit
// var css = novoForm.document.createElement("style");
// css.type = "text/css";
// css.innerHTML = ".strong { color: red }";
// novoForm.document.head.appendChild(css);
// novoForm.document.body.innerHTML = '<div class="strong">Hi there</div>';