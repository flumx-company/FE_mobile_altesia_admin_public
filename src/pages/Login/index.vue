<template>
  <div class="pannel">
    <Header />
    <div class="main-body">
      <div class="login-window">
        <div class="logo">
          <img src="../../assets/images/logo.png" alt="" >
        </div>
        <div class="title">
          Login to adminpanel
        </div>
          <Form @submit="onSubmit" :validation-schema="schema">
            <div class="input">
              <label for="email">Login</label>
              <Field id="email" name="email" type="email" />
              <ErrorMessage name="email" />
            </div>

            <div class="input">
              <label for="password">Password</label>
              <div class="password-input">
                <Field 
                  id="password" 
                  name="password" 
                  :type=" isPasswordVisible ? 'text' : 'password'" 
                />
                <div class="show-pass">
                  <img src="../../assets/images/eye-off.svg" alt="" v-if="!isPasswordVisible" @click="togglePassword">
                  <img src="../../assets/images/eye-on.svg" alt="" v-else @click="togglePassword">
                </div>
              </div>
              <ErrorMessage name="password" />
            </div>

            <div class="forgot-password">
              Forgot Password?
            </div>

            <div>
                <button class="login-btn">Submit</button>
            </div>
          </Form>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
    import Header from '@/components/Header.vue';
    import Footer from '@/components/Footer.vue';
    import { Field, Form, ErrorMessage } from "vee-validate";
    import * as yup from 'yup';
    import { $api } from "../../api";
    import { useRouter } from "vue-router";
    import { AltesiaTokenWorkerPlugin } from "../../plugins/token.plugin";
    import { ROUTES } from "../../router";
    import { ref } from 'vue';

    const onSubmit = (router) => {
        return async (data) => {
            try {
                const result = await $api.AuthRequest.signIn(data);
                if(result.data.token) {
                    AltesiaTokenWorkerPlugin.setToken(result.data.token);

                    await router.push(
                        router.currentRoute.value.query.redirectUrl
                            ? router.currentRoute.value.query.redirectUrl
                            : ROUTES.PANEL + '/' + ROUTES.USERS
                    )
                }
            } catch ( e ) {
                // toast
            }
        }
    };

    export default {
        name: "index",
        components: {
            Header,
            Footer,
            Field,
            Form,
            ErrorMessage
        },
        setup() {
            const router = useRouter();

            const schema = yup.object({
                email: yup
                    .string()
                    .required()
                    .email(),
                password: yup
                    .string()
                    .required()
                    .min(8)
            });

            const isPasswordVisible = ref(false);
            
            const togglePassword = () => {
              isPasswordVisible.value = !isPasswordVisible.value
            }

            return {
                schema,
                onSubmit: onSubmit(router),
                isPasswordVisible,
                togglePassword
            };
        }
    }
</script>

<style lang="scss" scoped>
    @import '../../assets/styles/_mixins.scss';
    @import '../../assets/styles/_colors.scss';
    @import '../../assets/styles/_login-page.scss';
</style>
