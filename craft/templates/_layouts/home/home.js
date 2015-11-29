var clickme = document.querySelector('#clickme')

function logMe(){
  return clickme.addEventListener('click',function(){
    console.log('you cddslicked the button');
  })
}

logMe()

// setInterval(function(){
//   counterNum = counterNum + increment
//   counterEl.innerHTML = counterNum
// },1000)
