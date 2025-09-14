// dataManager.js - Handle all JSON data operations

class DataManager {
  constructor() {
    this.courses = [];
    this.users = [];
    this.messages = [];
    this.currentUser = null;
    this.init();
  }

  // Initialize data manager
  async init() {
    try {
      // Load courses data
      const coursesResponse = await fetch('data/courses.json');
      this.courses = await coursesResponse.json();

      // Load users data
      const usersResponse = await fetch('data/users.json');
      this.users = await usersResponse.json();

      // Load messages data
      const messagesResponse = await fetch('data/messages.json');
      this.messages = await messagesResponse.json();

      // Check if user is logged in from localStorage
      const userData = localStorage.getItem('techtrainUser');
      if (userData) {
        this.currentUser = JSON.parse(userData);
      }
      
      // Load users from localStorage if available
      const storedUsers = localStorage.getItem('techtrainUsers');
      if (storedUsers) {
        this.users = JSON.parse(storedUsers);
      }
      
      // Load messages from localStorage if available
      const storedMessages = localStorage.getItem('techtrainMessages');
      if (storedMessages) {
        this.messages = JSON.parse(storedMessages);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  // Get all courses
  getAllCourses() {
    return this.courses;
  }

  // Get course by ID
  getCourseById(id) {
    return this.courses.find(course => course.id === parseInt(id));
  }

  // Get courses by category
  getCoursesByCategory(category) {
    return this.courses.filter(course => course.categoria === category);
  }

  // Search courses
  searchCourses(searchTerm) {
    const term = searchTerm.toLowerCase();
    return this.courses.filter(course => 
      course.titulo.toLowerCase().includes(term) || 
      course.descricao.toLowerCase().includes(term) || 
      course.categoria.toLowerCase().includes(term)
    );
  }

  // Get all categories
  getAllCategories() {
    const categories = [...new Set(this.courses.map(course => course.categoria))];
    return categories.map(category => ({ categoria: category }));
  }

  // User authentication
  login(email, password) {
    const user = this.users.find(u => u.email === email);
    if (user && password === user.senha) {
      this.currentUser = {
        id: user.id,
        nome: user.nome,
        email: user.email
      };
      localStorage.setItem('techtrainUser', JSON.stringify(this.currentUser));
      return true;
    }
    return false;
  }

  // User logout
  logout() {
    this.currentUser = null;
    localStorage.removeItem('techtrainUser');
    return true;
  }

  // Check if user is logged in
  isLoggedIn() {
    return this.currentUser !== null;
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  // Register new user
  register(nome, email, password) {
    // Check if user already exists
    if (this.users.some(u => u.email === email)) {
      return false;
    }

    // Create new user
    const newUser = {
      id: this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1,
      nome: nome,
      email: email,
      senha: password,
      enrollments: [],
      cart: []
    };

    this.users.push(newUser);
    
    // Save to localStorage
    localStorage.setItem('techtrainUsers', JSON.stringify(this.users));
    
    return true;
  }

  // Get user by ID
  getUserById(id) {
    return this.users.find(user => user.id === id);
  }

  // Add course to cart
  addToCart(courseId) {
    if (!this.isLoggedIn()) return false;

    const user = this.users.find(u => u.id === this.currentUser.id);
    if (!user.cart.includes(courseId)) {
      user.cart.push(courseId);
      
      // Save to localStorage
      localStorage.setItem('techtrainUsers', JSON.stringify(this.users));
      
      return true;
    }
    return false;
  }

  // Remove course from cart
  removeFromCart(courseId) {
    if (!this.isLoggedIn()) return false;

    const user = this.users.find(u => u.id === this.currentUser.id);
    const index = user.cart.indexOf(courseId);
    if (index > -1) {
      user.cart.splice(index, 1);
      
      // Save to localStorage
      localStorage.setItem('techtrainUsers', JSON.stringify(this.users));
      
      return true;
    }
    return false;
  }

  // Get user cart items
  getUserCart() {
    if (!this.isLoggedIn()) return [];

    const user = this.users.find(u => u.id === this.currentUser.id);
    return user.cart.map(courseId => this.getCourseById(courseId)).filter(course => course !== undefined);
  }

  // Clear user cart
  clearUserCart() {
    if (!this.isLoggedIn()) return false;

    const user = this.users.find(u => u.id === this.currentUser.id);
    user.cart = [];
    
    // Save to localStorage
    localStorage.setItem('techtrainUsers', JSON.stringify(this.users));
    
    return true;
  }

  // Enroll user in courses
  enrollUser(courses) {
    if (!this.isLoggedIn()) return false;

    const user = this.users.find(u => u.id === this.currentUser.id);
    courses.forEach(course => {
      if (!user.enrollments.includes(course.id)) {
        user.enrollments.push(course.id);
      }
    });
    
    // Save to localStorage
    localStorage.setItem('techtrainUsers', JSON.stringify(this.users));
    
    return true;
  }

  // Get user enrolled courses
  getUserEnrolledCourses() {
    if (!this.isLoggedIn()) return [];

    const user = this.users.find(u => u.id === this.currentUser.id);
    return user.enrollments.map(courseId => this.getCourseById(courseId)).filter(course => course !== undefined);
  }

  // Save contact message
  saveContactMessage(nome, email, mensagem) {
    const newMessage = {
      id: this.messages.length > 0 ? Math.max(...this.messages.map(m => m.id)) + 1 : 1,
      nome: nome,
      email: email,
      mensagem: mensagem,
      data_envio: new Date().toISOString()
    };

    this.messages.push(newMessage);
    
    // Save to localStorage
    localStorage.setItem('techtrainMessages', JSON.stringify(this.messages));
    
    return true;
  }

  // Update user profile
  updateProfile(nome, email) {
    if (!this.isLoggedIn()) return false;

    // Find the current user in the users array
    const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
    if (userIndex === -1) return false;

    // Update user data
    this.users[userIndex].nome = nome;
    this.users[userIndex].email = email;

    // Update current user object
    this.currentUser.nome = nome;
    this.currentUser.email = email;

    // Save to localStorage
    localStorage.setItem('techtrainUsers', JSON.stringify(this.users));
    localStorage.setItem('techtrainUser', JSON.stringify(this.currentUser));

    return true;
  }

  // Update user password
  updatePassword(currentPassword, newPassword) {
    if (!this.isLoggedIn()) return false;

    // Find the current user in the users array
    const user = this.users.find(u => u.id === this.currentUser.id);
    if (!user) return false;

    // Check if current password matches
    if (user.senha !== currentPassword) return false;

    // Update password
    user.senha = newPassword;

    // Save to localStorage
    localStorage.setItem('techtrainUsers', JSON.stringify(this.users));

    return true;
  }
}

// Create a global instance
const dataManager = new DataManager();