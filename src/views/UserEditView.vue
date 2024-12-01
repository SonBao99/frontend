<template>
    <div class="view-body">
        <div class="edit-container">
            <h1 class="page-title">Edit Your Profile</h1>

            <div class="profile-card">
                <div class="avatar-section">
                    <div class="avatar-wrapper">
                        <div class="current-avatar" v-if="!imagePreview">
                            <span class="user-avatar">{{ user.username.charAt(0) }}</span>
                        </div>
                        <img v-else :src="imagePreview" class="avatar-preview" alt="Avatar preview" />
                        
                        <div class="avatar-overlay">
                            <label for="avatar-upload" class="upload-overlay">
                                <i class="bi bi-camera"></i>
                                <span>Change</span>
                            </label>
                        </div>
                    </div>
                    <input type="file" id="avatar-upload" accept="image/*" @change="handleImageUpload" class="hidden">
                </div>

                <form @submit.prevent="updateProfile" class="edit-form">
                    <div class="form-group">
                        <label for="username">Username</label>
                        <div class="input-wrapper">
                            <i class="bi bi-person"></i>
                            <input 
                                type="text" 
                                id="username" 
                                v-model="formData.username" 
                                placeholder="Enter your username"
                                required
                            >
                        </div>
                    </div>

                    <div class="password-section">
                        <h3 class="section-title">Change Password</h3>
                        <div class="form-group">
                            <label for="currentPassword">Current Password</label>
                            <div class="input-wrapper">
                                <i class="bi bi-lock input-icon"></i>
                                <input 
                                    :type="showPassword.current ? 'text' : 'password'"
                                    id="currentPassword" 
                                    v-model="formData.currentPassword" 
                                    placeholder="Enter current password"
                                >
                                <button 
                                    type="button" 
                                    class="toggle-password"
                                    @click="togglePassword('current')"
                                >
                                    <i :class="showPassword.current ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                                </button>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="newPassword">New Password</label>
                            <div class="input-wrapper">
                                <i class="bi bi-lock input-icon"></i>
                                <input 
                                    :type="showPassword.new ? 'text' : 'password'"
                                    id="newPassword" 
                                    v-model="formData.newPassword" 
                                    placeholder="Enter new password"
                                    @input="validatePasswords"
                                >
                                <button 
                                    type="button" 
                                    class="toggle-password"
                                    @click="togglePassword('new')"
                                >
                                    <i :class="showPassword.new ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                                </button>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="confirmPassword">Confirm New Password</label>
                            <div class="input-wrapper">
                                <i class="bi bi-lock input-icon"></i>
                                <input 
                                    :type="showPassword.confirm ? 'text' : 'password'"
                                    id="confirmPassword" 
                                    v-model="formData.confirmPassword" 
                                    placeholder="Confirm new password"
                                    @input="validatePasswords"
                                >
                                <button 
                                    type="button" 
                                    class="toggle-password"
                                    @click="togglePassword('confirm')"
                                >
                                    <i :class="showPassword.confirm ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                                </button>
                            </div>
                            <span v-if="passwordError" class="error-message">{{ passwordError }}</span>
                        </div>
                    </div>

                    <div class="form-actions">
                        <router-link to="/user" class="cancel-btn">
                            <i class="bi bi-x"></i>
                            Cancel
                        </router-link>
                        <button type="submit" class="save-btn">
                            <i class="bi bi-check2"></i>
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import Api from "@/services/api";

export default {
    name: "UserEditView",
    data() {
        return {
            formData: {
                username: "",
                avatar: null,
                currentPassword: "",
                newPassword: "",
                confirmPassword: ""
            },
            imagePreview: null,
            showPassword: {
                current: false,
                new: false,
                confirm: false
            },
            passwordError: "",
            isValid: true
        }
    },
    computed: {
        user() {
            return this.$store.state.user;
        }
    },
    mounted() {
        this.formData.username = this.user.username;
    },
    methods: {
        handleImageUpload(event) {
            const file = event.target.files[0];
            if (file) {
                this.formData.avatar = file;
                this.imagePreview = URL.createObjectURL(file);
            }
        },
        async updateProfile() {
            if (!this.isValid) return;

            try {
                const formData = new FormData();
                formData.append('username', this.formData.username);
                if (this.formData.avatar) {
                    formData.append('avatar', this.formData.avatar);
                }
                if (this.formData.currentPassword && this.formData.newPassword) {
                    formData.append('currentPassword', this.formData.currentPassword);
                    formData.append('newPassword', this.formData.newPassword);
                }

                await Api.put("/users/profile", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                await this.$store.dispatch("updateStore");
                this.$toast.success("Profile updated successfully", {
                    position: "bottom-left",
                    duration: 1000
                });
                this.$router.push("/user");
            } catch (error) {
                console.error(error);
                this.$toast.error(error.response?.data?.message || "Failed to update profile", {
                    position: "bottom-left",
                    duration: 3000
                });
            }
        },
        togglePassword(field) {
            this.showPassword[field] = !this.showPassword[field];
        },
        validatePasswords() {
            if (this.formData.newPassword || this.formData.confirmPassword) {
                if (this.formData.newPassword.length < 8) {
                    this.passwordError = "Password must be at least 8 characters long";
                    this.isValid = false;
                } else if (this.formData.newPassword !== this.formData.confirmPassword) {
                    this.passwordError = "Passwords do not match";
                    this.isValid = false;
                } else {
                    this.passwordError = "";
                    this.isValid = true;
                }
            } else {
                this.passwordError = "";
                this.isValid = true;
            }
        }
    }
}
</script>

<style scoped>
.edit-container {
    max-width: 700px;
    margin: 2rem auto;
    padding: 0 1.5rem;
}

.page-title {
    font-size: 2rem;
    color: #1F2937;
    margin-bottom: 2rem;
    text-align: center;
}

.profile-card {
    background: white;
    border-radius: 16px;
    padding: 2.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.avatar-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 2.5rem;
}

.avatar-wrapper {
    position: relative;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.current-avatar {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #3B82F6, #2563EB);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3.5rem;
    color: white;
    text-transform: uppercase;
}

.avatar-preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.avatar-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
    padding: 0.75rem;
    transform: translateY(100%);
    transition: transform 0.3s ease;
}

.avatar-wrapper:hover .avatar-overlay {
    transform: translateY(0);
}

.upload-overlay {
    color: white;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    cursor: pointer;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #4B5563;
    font-weight: 500;
}

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    border: 1px solid #E5E7EB;
    border-radius: 8px;
    transition: all 0.3s ease;
}

.input-wrapper:focus-within {
    border-color: #3B82F6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-icon,
.bi-person,
.bi-lock {
    position: absolute;
    left: 1.5rem;
    color: #6B7280;
    pointer-events: none;
}

.input-wrapper input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 3rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    outline: none;
    background: transparent;
}

.form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
}

.save-btn,
.cancel-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.2s ease;
}

.save-btn {
    background: linear-gradient(135deg, #3B82F6, #2563EB);
    color: white;
    border: none;
    flex: 1;
    justify-content: center;
}

.save-btn:hover {
    background: linear-gradient(135deg, #2563EB, #1D4ED8);
    transform: translateY(-1px);
}

.cancel-btn {
    background-color: #F3F4F6;
    color: #4B5563;
    border: 1px solid #E5E7EB;
}

.cancel-btn:hover {
    background-color: #E5E7EB;
}

.hidden {
    display: none;
}

.password-section {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid #E5E7EB;
}

.section-title {
    font-size: 1.25rem;
    color: #374151;
    margin-bottom: 1.5rem;
}

.toggle-password {
    position: relative;
    padding: 0.75rem 1rem;
    background: none;
    border: none;
    color: #6B7280;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: color 0.2s ease;
}

.toggle-password:hover {
    color: #374151;
}

.error-message {
    display: block;
    color: #DC2626;
    font-size: 0.875rem;
    margin-top: 0.5rem;
}
</style>