

export function menubar()
{


  // Polyfill
  if (HTMLCollection.prototype.forEach === undefined) { HTMLCollection.prototype.forEach = [].forEach }

  function showMenu(e)
  { 
    closeAllMenus(); 
    this.classList.add('activeMenu'); 
    e.stopPropagation() 
  }

  function closeAllMenus() 
  { 
    document.getElementsByClassName('activeMenu').forEach(function (node) { node.classList.remove('activeMenu') }) 
  }

  (function() 
  {
    function on(e,f){window.addEventListener(e,f)
  }

  // Show menu event handler
  on('load', function (event) 
  { 
    document.getElementsByClassName('menuLabel').forEach(function(node) { node.onclick = showMenu }) 
  })

  // Close all open menus on click or escape
  on('click', closeAllMenus, true)
  on('keydown', function (event) { (event.key === "Escape") && closeAllMenus() }, true)

  })();

}

