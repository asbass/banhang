var app = angular.module("app", ["firebase", "ngRoute"]);
app.config(function ($routeProvider) {
    $routeProvider
        .when("/home", {
            templateUrl: "home.html"
        })

        .when("/contact", {
            templateUrl: "contact.html"
        })
        .when("/chitiet", {
            templateUrl: "chitiet.html"
        })
        .when("/dangki", {
            templateUrl: "dangki.html"
        })
        .when("/dangnhap", {
            templateUrl: "dangnhap.html"
        })
        .when("/contact", {
            templateUrl: "contact.html"
        })
        .when("/danhsachdoc", {
            templateUrl: "productgird.html"
        })
        .when("/danhsachngang", {
            templateUrl: "productlitst.html"
        })
        .when("/giohang", {
            templateUrl: "cart.html"
        })
        .otherwise("/home", {
            redirectTo: "/home"
        })
});
app.run(function ($rootScope) {
    $rootScope.$on('$routeChangeStart', function () {
        $rootScope.loading = true;
    })

    $rootScope.$on('$routeChangeSuccess', function () {
        $rootScope.loading = false;
    })

    $rootScope.$on('$routeChangeError', function () {
        $rootScope.loading = false;
        alert("Lỗi, không tải được template");
    })
    var config = {
        apiKey: "AIzaSyCWAtL3rUA2Vjt78lmNFr7xY67yUS9yfH8",
        authDomain: "shopbanhang-68b54.firebaseapp.com",
        databaseURL: "https://shopbanhang-68b54-default-rtdb.firebaseio.com",
        projectId: "shopbanhang-68b54",
        storageBucket: "shopbanhang-68b54.appspot.com",
        messagingSenderId: "647018400125",
        appId: "1:647018400125:web:2771fac6bc5d1dd9a6a414",
        measurementId: "G-CV7XJQBM9M"
    };
    firebase.initializeApp(config);
});
app.controller("myCtrl", ["$scope", "$firebaseArray", function ($scope, $firebaseArray) {
    var ref = firebase.database().ref("sanpham");
    var list = $firebaseArray(ref);
    var ref2 = firebase.database().ref("users");
    var list2 = $firebaseArray(ref2);
    $scope.data = [];
    $scope.total = 0;
    $scope.begin = 0;
    var id = new URL(document.URL).searchParams.get('id');

    list.$loaded()
        .then(function (x) {
            console.log(x.length)
            console.log(x.$id)
            if (id) {
                console.log(x.$id)

                $scope.item = x.filter((x) => x.$id === id)
                console.log(item.$id)
            }
            $scope.data = x
            
            $scope.pageCount = Math.ceil($scope.data.length / 4);
            $scope.first = () => {
                $scope.begin = 0;
            }
            $scope.prev = () => {
                if ($scope.begin > 0) {
                    $scope.begin -= 4;
                }
            }
            $scope.next = () => {
                if ($scope.begin < ($scope.pageCount - 1) * 4) {
                    $scope.begin += 4;
                    console.log("taideptrai")
                }
                console.log("taideptrai")
            }
            $scope.last = () => {
                $scope.begin = ($scope.pageCount - 1) * 4;
            }
        })
        .catch(function (error) {
            console.log("Error:", error);
        });
    // list.$loaded(
    //     function (x) {
    //         $scope.data = x;
    //         console.log(x); // true
    //     }, function (error) {
    //         console.error("Error:", error);
    //     });

    $scope.data = list;
    $scope.cart = JSON.parse(localStorage.getItem("Cart") || '[]');
    $scope.total = localStorage.getItem("total");


    $scope.addcart = (sp) => {
        var index = $scope.cart.findIndex((item) => {
            return (item.sanpham.$id == sp.$id);
        });
        if (index < 0) {
            var newSP = {
                sanpham: sp,
                slBan: 1
            };
            $scope.cart.push(newSP);
        } else {
            $scope.cart[index].slBan++
        }
        $scope.total++;
        localStorage.setItem("total", JSON.stringify($scope.total));
        $scope.total = localStorage.getItem("total");
        localStorage.setItem("Cart", JSON.stringify($scope.cart));
        $scope.cart = JSON.parse(localStorage.getItem("Cart") || '[]');
    }

    $scope.increase = (sp) => {
        $scope.cart.forEach(x => {
            if (x.sanpham.$id === sp.sanpham.$id) {
                x.slBan++;
                $scope.total++;
            }
        })
        localStorage.setItem("total", JSON.stringify($scope.total));
        localStorage.setItem("Cart", JSON.stringify($scope.cart));
    }

    $scope.decrease = (sp) => {
        if (sp.slBan > 1) {
            $scope.cart.forEach(x => {
                if (x.sanpham.$id === sp.sanpham.$id) {
                    x.slBan--;
                    $scope.total--;
                }
            })
            localStorage.setItem("total", JSON.stringify($scope.total));
            localStorage.setItem("Cart", JSON.stringify($scope.cart));
        }
    }

    $scope.removeCart = (sp) => {
        $scope.cart = $scope.cart.filter(x => x.sanpham.$id !== sp.sanpham.$id)
        $scope.total -= sp.slBan
        localStorage.setItem("total", JSON.stringify($scope.total));
        localStorage.setItem("Cart", JSON.stringify($scope.cart));
    }

    $scope.subtotal = () => {
        var subtotal = 0;
        if ($scope.total != 0) {
            for (let i in $scope.cart) {
                subtotal += $scope.cart[i].sanpham.gia * $scope.cart[i].slBan;
            }
        }
        return subtotal;
    }

    list2.$loaded()
        .then(function (x) {
            $scope.accountList = x;
        })
        .catch(function (error) {
            console.log("Error:", error);
        });
    $scope.addAccount = function () {
        var abj = {};
        abj.username = $scope.txttendn;
        abj.name = $scope.txtname;
        abj.password = $scope.txtpass;
        abj.email = $scope.txtEmail;
        abj.address = $scope.txtdc;

        list2.$add(abj);
        // document.querySelector('.cancelbtn1').click();
        alert("Ban da dang ki tai khoan thanh cong!!!");
    }
    $scope.loginAccount = () => {
        for (let i in $scope.accountList) {
            if ($scope.username == $scope.accountList[i].username) {
                if ($scope.password == $scope.accountList[i].password) {
                    $scope.isLogin = true;
                    $scope.user = $scope.accountList[i]
                    if ($scope.RememberMe) {
                        sessionStorage.setItem("users", JSON.stringify($scope.user))
                    }
                    location.replace('/tai/shop/index.html#!/home');
                    alert('đăng nhập thành công');
                    break;
                }
            }
        }
    }
}


]);