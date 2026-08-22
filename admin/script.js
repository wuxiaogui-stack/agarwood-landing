document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* =====================================================
           Supabase 配置
        ===================================================== */

        const SUPABASE_URL =
            "https://tvythmezaecdtqlqtwnh.supabase.co";


        const SUPABASE_KEY =
            "sb_publishable_SMgtLo5Zh15EWzVgTKoKHg_ci8lOFp6";


        /* =====================================================
           创建 Supabase Client
        ===================================================== */

        const supabaseClient =
            window.supabase.createClient(
                SUPABASE_URL,
                SUPABASE_KEY
            );


        /* =====================================================
           页面元素
        ===================================================== */

        const loginForm =
            document.getElementById(
                "loginForm"
            );


        const usernameInput =
            document.getElementById(
                "username"
            );


        const passwordInput =
            document.getElementById(
                "password"
            );


        const loginMessage =
            document.getElementById(
                "loginMessage"
            );


        const loginButton =
            document.getElementById(
                "loginButton"
            );


        if (!loginForm) {
            return;
        }


        /* =====================================================
           显示提示
        ===================================================== */

        function showMessage(
            message,
            type
        ) {

            if (!loginMessage) {
                return;
            }


            loginMessage.textContent =
                message;


            loginMessage.classList.remove(
                "success",
                "error",
                "loading"
            );


            if (type) {

                loginMessage.classList.add(
                    type
                );

            }

        }


        /* =====================================================
           按钮状态
        ===================================================== */

        function setLoading(
            loading
        ) {

            if (!loginButton) {
                return;
            }


            loginButton.disabled =
                loading;


            if (loading) {

                loginButton.textContent =
                    "正在登录…";


                loginButton.classList.add(
                    "loading"
                );

            } else {

                loginButton.textContent =
                    "登录后台";


                loginButton.classList.remove(
                    "loading"
                );

            }

        }


        /* =====================================================
           登录
        ===================================================== */

        loginForm.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const username =
                    usernameInput.value.trim();


                const password =
                    passwordInput.value;


                showMessage(
                    "",
                    ""
                );


                /* ---------------------------------------------
                   检查输入
                --------------------------------------------- */

                if (
                    !username ||
                    !password
                ) {

                    showMessage(
                        "请输入管理员账号和密码。",
                        "error"
                    );

                    return;

                }


                /* ---------------------------------------------
                   开始登录
                --------------------------------------------- */

                setLoading(true);


                showMessage(
                    "正在验证管理员账号…",
                    "loading"
                );


                try {

                    /* =================================================
                       使用 Supabase JS Auth
                       
                       这里非常重要：
                       
                       signInWithPassword()
                       会自动建立 Supabase Session
                       
                       dashboard.html
                       就可以正常使用：
                       
                       supabaseClient.auth.getUser()
                       ================================================= */

                    const {
                        data,
                        error
                    } =
                        await supabaseClient
                            .auth
                            .signInWithPassword({

                                email:
                                    username,

                                password:
                                    password

                            });


                    /* =================================================
                       登录失败
                    ================================================= */

                    if (error) {

                        console.error(
                            "Supabase 登录失败：",
                            error
                        );


                        setLoading(false);


                        showMessage(
                            "账号或密码错误。",
                            "error"
                        );


                        return;

                    }


                    /* =================================================
                       检查 Session
                    ================================================= */

                    if (
                        !data ||
                        !data.session
                    ) {

                        console.error(
                            "登录成功，但是没有 Session：",
                            data
                        );


                        setLoading(false);


                        showMessage(
                            "登录失败，服务器没有建立登录状态。",
                            "error"
                        );


                        return;

                    }


                    /* =================================================
                       检查用户
                    ================================================= */

                    if (
                        !data.user
                    ) {

                        console.error(
                            "登录成功，但是没有用户信息：",
                            data
                        );


                        setLoading(false);


                        showMessage(
                            "登录失败，没有读取到管理员账号。",
                            "error"
                        );


                        return;

                    }


                    /* =================================================
                       登录成功
                    ================================================= */

                    console.log(
                        "Supabase 管理员登录成功"
                    );


                    console.log(
                        "当前用户：",
                        data.user.email
                    );


                    console.log(
                        "Session 已建立"
                    );


                    /* =================================================
                       保存辅助信息
                       
                       注意：
                       
                       真正的 Supabase Session
                       已经由 Supabase JS 自动保存。
                       
                       下面这些只是为了兼容之前的系统，
                       不参与 dashboard 登录认证。
                    ================================================= */

                    localStorage.setItem(
                        "admin_user",
                        JSON.stringify(
                            data.user
                        )
                    );


                    localStorage.setItem(
                        "admin_login_time",
                        String(
                            Date.now()
                        )
                    );


                    /* =================================================
                       显示登录成功
                    ================================================= */

                    showMessage(
                        "登录成功，正在进入后台…",
                        "success"
                    );


                    setLoading(true);


                    /* =================================================
                       跳转后台
                    ================================================= */

                    setTimeout(
                        function () {

                            window.location.href =
                                "dashboard.html";

                        },
                        500
                    );


                } catch (error) {

                    /* =================================================
                       登录异常
                    ================================================= */

                    console.error(
                        "管理员登录异常：",
                        error
                    );


                    setLoading(false);


                    showMessage(
                        "登录系统异常，请检查网络连接。",
                        "error"
                    );

                }

            }
        );


        /* =====================================================
           用户名输入框回车
        ===================================================== */

        if (usernameInput) {

            usernameInput.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key === "Enter"
                    ) {

                        event.preventDefault();


                        if (passwordInput) {

                            passwordInput.focus();

                        }

                    }

                }
            );

        }


        /* =====================================================
           页面初始化
        ===================================================== */

        showMessage(
            "",
            ""
        );

    }
);