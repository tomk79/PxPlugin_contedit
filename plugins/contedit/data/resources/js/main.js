$(window).load(function(){
	$('a').each(function(){
		this.href = 'javascript:alert(\'編集中のため押せません。\');'
		this.onclick = 'alert(\'編集中のため押せません。\'); return false;'
	});

	var elmContent = $('#content');
	elmContent.html('<p>開発中です。</p>');
});
