function page_discountcalculator_calculate(percentage) {
	full_price=$('#page_discountcalculator_fullprice').val();
	discount=((full_price/100)*percentage);
	discount=discount.toFixed(2);
	discounted_value=full_price-discount;
	discounted_value=discounted_value.toFixed(2);
	console.log(discounted_value);

	$('#page_discountcalculator_results').show();
	$('#page_discountcalculator_discountamount').text(discount);
	$('#page_discountcalculator_discounttotal').text(discounted_value);
};
