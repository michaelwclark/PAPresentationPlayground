require.config({
  shim: {
    "bootstrap" : { "deps" :['jquery']}
  },
  paths:{
    "jquery" : ["//code.jquery.com/jquery-2.1.4.min","libs/jquery-2.1.4.min"],
    "bootstrap" : ["https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min", "libs/bootrstap.min"]
  }
});


require(['jquery', 'bootstrap'], function($){
  console.log("Loaded Bootstrap w/ RequireJS");
  return {};
}
);
