function setHeaderFooter() {
  $("#header").load("/pages/header.html");
  $("#footer").load("/pages/footer.html");
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function setCookie(name, value){
  document.cookie = `${name}=${(value || "")}; path=/`;
}


function showModalLoginRequired() {
  $('#confirmModal').modal('show');
}
function hideModalLoginRequired() {
  $('#confirmModal').modal('hide')
}
function modalLogin() {
  $('#confirmModal').modal('hide')
  window.location.href = "/pages/login.html";
}
function modalRegister() {
  $('#confirmModal').modal('hide')
  window.location.href = "/pages/signup.html";
}



/* ------------- CART ------------- */

function fillCartPage(json) {
  
  console.log(json.books.length)
  if(json.books.length !== 0){
    console.log(json.books.length)
    document.getElementById('emptyCart').classList.add('not-display');

    var bookArray = json.books;
    var subtotal = json.subtotal;
    for (const book of bookArray) {
      let book_name = book.book_name;
      // console.log(typeof book.price.value)
      // console.log(typeof book.total.value)
      let price = new String(book.price.currency).concat(" ").concat((book.price.value).toFixed(2));
      let total = new String(book.total.currency).concat(" ").concat((book.total.value).toFixed(2));
      let quantity = book.quantity;
      let img_path = book.img_path;

      let listItem = document.createElement('div');
      listItem.classList.add('row');
      listItem.classList.add('align-items-center');

      listItem.innerHTML = `
        <div class="col-12 text-center col-md-2 text-center">
                <img src="${img_path}" alt="thumbnail" class="card-cart">
        </div>
        <div class="col-12 text-center col-md-3 text-md-center">
            <h4 class="product-name"><strong>${book_name}</strong></h4>
        </div>
        <div class="col-12 col-sm-12 text-sm-center col-md-7 text-md-center row">
            <div class="col-3 col-sm-3 col-md-3 text-md-left" style="padding-top: 5px">
                <h6>${price}</h6>
            </div>
            <div class="col-2 col-sm-2 col-md-2 text-md-center">
            <label>
              <span class="not-display">Quantity</span>
              <input data-isbn="${book.ISBN}" type="number" class="form-control" name="quantity" min="1" max="999" step="1" value="${quantity}"
              style="width: 75px" onchange="updateCartItemQuantity(this)">
            </label>
            </div>
            <div class="col-1 col-sm-1 col-md-1 text-md-center"></div>
            <div class="col-2 col-sm-2 col-md-2 text-md-center">
                <button type="button" data-isbn='${book.ISBN}' onclick='removeFromCart(this)' class="btn btn-outline-danger btn-xs">
                    <i class="fa fa-trash" aria-hidden="true"></i>
                </button>
            </div>
            <div class="col-3 col-sm-3 col-md-3 text-right">
              <p><strong>${book.total.currency} ${(book.total.value).toFixed(2)}</strong></p>
            </div>
        </div>`

      // add entry book
      document.getElementById('cartList').append(listItem);
      // add line
      document.getElementById('cartList').append(document.createElement('hr'));
    }

    document.getElementById('subtotal').innerHTML = `${json.books[0].total.currency} ${(subtotal).toFixed(2)}`;

  } else {
    
    document.getElementById('emptyCart').classList.remove('not-display');
    document.getElementById('subtotal').innerHTML = ` ${(json.subtotal).toFixed(2)}`;
  }
  
}

// function showEmptyCart(){
//   var elem = document.getElementById('emptyCart');
//   if(elem.classList.contains('not-visible')){
//     elem.classList.remove('not-visible');
//   } else {
//     elem.classList.add('not-visible');
//   }
// }


function removeFromCart(evtTarget) {
  var isbn = evtTarget.getAttribute('data-isbn');

  let options = {
    method: "DELETE",
    credentials: 'same-origin',
    // headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded'
    // }
  }

  fetch(`/api/cart?isbn=${isbn}`, options)
    .then(function(response) {  
      if (response.status === 200) {
        return response.json();
      } else {
        throw response;
      }
    })
    .then(json => {
      // window.location.reload(true);
      document.getElementById('cartList').innerHTML = "";
      fillCartPage(json);
      console.log(json);
    })
    .catch(e => {
      console.error(e.status);
      if(e.headers.get("content-type") == "application/json"){
        e.json().then(json => {
          console.error(json.message)
        })
      } else {
        e.text().then(text => {
          console.error(text)
        })
      }
    });
}


function updateCartItemQuantity(evtTarget) {
  var isbn = evtTarget.getAttribute('data-isbn');
  var quantity = evtTarget.value;
  var obj = {
    isbn: parseInt(isbn),
    quantity: parseInt(quantity)
  };
  var json = JSON.stringify(obj);
  let options = {
    body: json,
    method: "PATCH",
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    }
  }

  fetch(`/api/cart`, options)
    .then(function(response) {
      if (response.status === 200) {
        return response.json();
      } else {
        throw response;
      }
    })
    .then(jsonCart => {
      // window.location.reload(true);
      document.getElementById('cartList').innerHTML = "";
      fillCartPage(jsonCart);
      console.log(jsonCart);
    })
    .catch(e => {
      console.error(e.status);
      if(e.headers.get("content-type") == "application/json"){
        e.json().then(json => {
          console.error(json.message)
        })
      } else {
        e.text().then(text => {
          console.error(text)
        })
      }
    });
}

function putReviews(b_reviews, put_in) {
  for (let i = 0; i < b_reviews.length; i++) {
          let listItem = document.createElement('div');
          listItem.classList.add('review');
          let {
            ISBN,
            review,
            name,
            email
          } = b_reviews[i]
          listItem.innerHTML = `
              <h6>Review by ${name} - ${email}</h6>
              <p>${review}</p>
              <hr>
              `;
          document.getElementById(put_in).append(listItem);
    }
  }
