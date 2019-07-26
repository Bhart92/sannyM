$(window).ready(function(){
  //lazy load project images
  $('.ui.column img')
    .visibility({
        type       : 'image',
        transition : 'fade in',
        duration   : 1500,
        interval: 500
      })
  ;
  //opens login modal on '`' press
  $(document).on('keydown', function (evt) {
  if (evt.keyCode === 192) {
    $('.ui.modal.login')
      .modal('show')
      ;
    }
  });
  //lightbox config
  lightbox.option({
    'wrapAround': true,
    'disableScrolling': true
  })
  //error handling messages
  $('.ui.positive.message').delay(2000).fadeOut();
  $('.ui.negative.message').delay(2000).fadeOut();
  //loader visibililty toggle
  $('form').submit(function(){
    $('#loader-4 span').css("visibility", "visible");
    });
  //shows edit about section modal
  $('#editAbout').on('click', function(){
    $('#editLinkAbout')
      .modal('show')
   ;
  });
  //shows new project modal
  $('#addNewLink').on('click', function(e){
    $('#projectLink')
      .modal('show')
   ;});
  // show new project modal on mobile
  $('#mobileNewLink').on("click", function(e){
    $('.ui.modal.editLink')
      .modal('show')
   ;
 });

 $("#editBtnAbout").on('click', function(){
     $('#editLinkAbout')
       .modal('show')
    ;
 });
});
