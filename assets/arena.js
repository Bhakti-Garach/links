// Use botton
// Use modal
// Use filter
// Mobile Menu Toggle
let menuToggle = document.querySelector('#menu-toggle');
let navLinks = document.querySelector('#nav-links');

menuToggle.onclick = () => { 
    navLinks.classList.toggle('active'); 
    menuToggle.textContent = navLinks.classList.contains('active') ? '[CLOSE]' : '[MENU]'; 
};