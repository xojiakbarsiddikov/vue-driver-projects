import axios from "axios";
import {API_URL} from "../helper"
import {teacherRoleId} from "../helper";

export default {
    namespaced: true,
    state: {
        token: null,
        user: null,
        teacher: null
    },
    mutations: {
        SET_TOKEN(state, token) {
            state.token = token;
        },

        SET_USER(state, user) {
            state.user = user;
        },
        SET_TEACHER(state, teacher) {
            state.teacher = teacher
        }
    },
    getters: {
        loggedIn(state) {
            return state.token && state.user;
        },

        user(state) {
            return state.user;
        },
        teacher(state) {
            return state.teacher
        }
    },
    actions: {
        async login({dispatch}, credentials) {
            let response = await axios.post(API_URL + "auth/login", credentials);
            if (response.status !== 200) {
                return
            }
            return dispatch("attempt", response.data.token);
        },
        logout({commit}) {
            commit("SET_TOKEN", null)
            commit("SET_USER", null)
        },
        async attempt({commit, state}, token) {
            if (token) {
                commit("SET_TOKEN", token)
            }
            if (!state.token) {
                return;
            }

            try {
                let res = await axios.get(API_URL + "auth/profile");
                await commit("SET_USER", res.data);
                if (res.data.roleId === teacherRoleId) {
                    const teacher = await axios.get(API_URL+`teacher/${res.data.user_id}`).then(res => res.data)
                    commit('SET_TEACHER', teacher)
                }
            } catch (e) {
                // commit("SET_TOKEN", null);
                commit("SET_USER", null);
            }
        }
    },
    modules: {

    }
}