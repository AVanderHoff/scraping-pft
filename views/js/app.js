
// initial value used for naviagtion between different articles
var init = -1;

var currentURL = window.location.origin;

//post comment, display updated comments list
function postComment(){
	
	var comment = $('#entry').val().trim();
	var commentObj = {
		body:comment
	}

	var query = '?number=' + init ;
	$.post(currentURL + "/postcomments" + query , commentObj, function(res){
		console.log('article ' + init + ' posted');
		
		$('#comments').empty();
		var ul = $('<ul>');
		for(var i=0 ; i < res.length ;i++){
			ul.append('<li>' + res[i].body + '</li>');
		}
		$('#comments').html(ul);
	});

}

//delete last comment in array and display new comments
function deleteComment(){

	var query = '?number=' + init ;
	$.get(currentURL + "/deletecomment"+ query, function(data){

		var ul = $('<ul>');
		for(var i = 0 ; i < (data.length - 1) ; i++){
			ul.append('<li>'+ data[i].body + '</li>');
		}
		$('#comments').html(ul);
	});
}

// goes to next article in database by article id and init
function nextArticle(){

	$.get(currentURL + '/count',function(count){

		if(count.count!==(init + 1)){
			$('#comments').empty();
			var query = '?number=' + (init + 1);
			$.get(currentURL + "/articles"+ query, function(data){	
				console.log(data);

			if(data.article){
				init = data.article._id ;	
				var content = data.article.content;
				var title = data.article.title;

				var div = $('<div>');
			if(content){
				div.append('<h3>' + title + '</h3>');
				for(var i=0 ; i < content.length ; i++){
					div.append(content[i]);	
				}
				$('#articles').html(div);
			}
		
		 		var comments = data.article.comments;
		 		var ul = $('<ul>');
		 	if(comments.length >= 1){
		 		for(var q=0 ; q < comments.length ; q++){
					ul.append('<li>' + comments[q].body + '</li>');
				}
				$('#comments').html(ul);
			}

			}

		});
	}
	})
}


function previousArticle(){

	if(init >= 1){
		$('#comments').empty();
		var query = '?number=' + (init - 1);
		
		$.get(currentURL + "/articles"+ query, function(data){	
			console.log(data);
			init = data.article._id ;	
			var content = data.article.content;
			var title = data.article.title;
		
			var div = $('<div>');
			if(content){
				div.append('<h3>'+ title + '</h3>');
				for(var i=0 ; i < content.length ; i++){
					div.append(content[i]);	
				}
					$('#articles').html(div);

			}
		
		 	var comments = data.article.comments;
		 	var ul = $('<ul>');
		 	if(comments.length >= 1){
		 		for(var q=0 ; q < comments.length ; q++){
					ul.append('<li>' + comments[q].body + '</li>');
			
				}
				$('#comments').html(ul);

		 	}

		});
	}
}


window.onload = nextArticle;

$('#next').on('click',function(){
	nextArticle();
});


$('#previous').on('click',function(){
	previousArticle();
});


$('#submit').on('click',function(){
	postComment();
	$('#entry').val('');
})

$('#scrape').on('click',function(){
	$.get(currentURL + "/scrape");	
})

$('#delete').on('click',function(){

	deleteComment();
})