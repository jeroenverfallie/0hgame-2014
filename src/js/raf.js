export default (function(){
  return  function( callback ){
            window.setTimeout(callback, 1000 / 10);
          };
})();