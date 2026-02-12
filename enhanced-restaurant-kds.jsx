import React, { useState, useEffect, useRef } from 'react';
import { 
  Clock, ChefHat, AlertCircle, CheckCircle, Timer, Flame, Users, TrendingUp,
  Database, BarChart3, Package, DollarSign, Bell, Settings, Filter, Download,
  MessageSquare, Printer, RefreshCw, TrendingDown, Star, Calendar, Search,
  Archive, Trash2, Edit, Plus, X, Activity, Zap, Target, ShoppingCart
} from 'lucide-react';

// ==================== DATABASE SCHEMA ====================

// Simulated database using localStorage with indexedDB-like structure
class RestaurantDatabase {
  constructor() {
    this.dbName = 'restaurantKDS';
    this.initialize();
  }

  initialize() {
    if (!localStorage.getItem(this.dbName)) {
      const initialDB = {
        orders: [],
        menuItems: this.getDefaultMenu(),
        inventory: this.getDefaultInventory(),
        staff: this.getDefaultStaff(),
        analytics: {
          daily: [],
          weekly: [],
          monthly: []
        },
        settings: {
          autoAcceptOrders: true,
          soundEnabled: true,
          delayThreshold: 5,
          targetPrepTime: 15
        },
        customers: [],
        reviews: []
      };
      this.save(initialDB);
    }
  }

  load() {
    return JSON.parse(localStorage.getItem(this.dbName) || '{}');
  }

  save(data) {
    localStorage.setItem(this.dbName, JSON.stringify(data));
  }

  // CRUD Operations
  addOrder(order) {
    const db = this.load();
    db.orders.push({ ...order, id: Date.now(), createdAt: new Date().toISOString() });
    this.save(db);
    this.updateAnalytics(order);
    return db.orders[db.orders.length - 1];
  }

  updateOrder(orderId, updates) {
    const db = this.load();
    db.orders = db.orders.map(order => 
      order.id === orderId ? { ...order, ...updates, updatedAt: new Date().toISOString() } : order
    );
    this.save(db);
  }

  getOrders(filter = {}) {
    const db = this.load();
    let orders = db.orders;
    
    if (filter.status) {
      orders = orders.filter(o => o.status === filter.status);
    }
    if (filter.station) {
      orders = orders.filter(o => o.items.some(i => i.station === filter.station));
    }
    if (filter.date) {
      orders = orders.filter(o => {
        const orderDate = new Date(o.createdAt).toDateString();
        return orderDate === new Date(filter.date).toDateString();
      });
    }
    
    return orders;
  }

  // Menu Management
  addMenuItem(item) {
    const db = this.load();
    db.menuItems.push({ ...item, id: Date.now() });
    this.save(db);
  }

  updateMenuItem(itemId, updates) {
    const db = this.load();
    db.menuItems = db.menuItems.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    );
    this.save(db);
  }

  deleteMenuItem(itemId) {
    const db = this.load();
    db.menuItems = db.menuItems.filter(item => item.id !== itemId);
    this.save(db);
  }

  // Inventory Management
  updateInventory(itemName, quantity) {
    const db = this.load();
    const item = db.inventory.find(i => i.name === itemName);
    if (item) {
      item.quantity = quantity;
      item.lastUpdated = new Date().toISOString();
      if (quantity < item.minQuantity) {
        item.status = 'low';
      } else {
        item.status = 'good';
      }
    }
    this.save(db);
  }

  // Analytics
  updateAnalytics(order) {
    const db = this.load();
    const today = new Date().toDateString();
    
    if (!db.analytics.daily[today]) {
      db.analytics.daily[today] = {
        orders: 0,
        revenue: 0,
        avgPrepTime: 0,
        popularItems: {}
      };
    }
    
    db.analytics.daily[today].orders++;
    db.analytics.daily[today].revenue += order.total || 0;
    
    order.items.forEach(item => {
      if (!db.analytics.daily[today].popularItems[item.name]) {
        db.analytics.daily[today].popularItems[item.name] = 0;
      }
      db.analytics.daily[today].popularItems[item.name]++;
    });
    
    this.save(db);
  }

  getAnalytics(period = 'today') {
    const db = this.load();
    const today = new Date().toDateString();
    
    if (period === 'today') {
      return db.analytics.daily[today] || { orders: 0, revenue: 0, avgPrepTime: 0, popularItems: {} };
    }
    
    return db.analytics;
  }

  // Default Data
  getDefaultMenu() {
    return [
      { id: 1, name: "Caesar Salad", category: "appetizer", station: "salad", price: 12.99, prepTime: 3, cookTime: 0, ingredients: ["lettuce", "parmesan", "croutons"], active: true, popularity: 85 },
      { id: 2, name: "Buffalo Wings", category: "appetizer", station: "fry", price: 14.99, prepTime: 2, cookTime: 12, ingredients: ["chicken wings", "buffalo sauce"], active: true, popularity: 92 },
      { id: 3, name: "Ribeye Steak", category: "main", station: "grill", price: 34.99, prepTime: 5, cookTime: 15, ingredients: ["ribeye", "seasoning"], active: true, popularity: 88 },
      { id: 4, name: "Grilled Salmon", category: "main", station: "grill", price: 28.99, prepTime: 4, cookTime: 10, ingredients: ["salmon", "lemon", "herbs"], active: true, popularity: 78 },
      { id: 5, name: "Pasta Carbonara", category: "main", station: "saute", price: 22.99, prepTime: 3, cookTime: 8, ingredients: ["pasta", "bacon", "eggs", "parmesan"], active: true, popularity: 82 },
      { id: 6, name: "Chicken Parmesan", category: "main", station: "fry", price: 24.99, prepTime: 5, cookTime: 18, ingredients: ["chicken", "marinara", "mozzarella"], active: true, popularity: 86 },
      { id: 7, name: "French Fries", category: "side", station: "fry", price: 5.99, prepTime: 1, cookTime: 6, ingredients: ["potatoes"], active: true, popularity: 95 },
      { id: 8, name: "Grilled Vegetables", category: "side", station: "grill", price: 7.99, prepTime: 2, cookTime: 8, ingredients: ["zucchini", "peppers", "onions"], active: true, popularity: 65 },
      { id: 9, name: "Tiramisu", category: "dessert", station: "dessert", price: 9.99, prepTime: 3, cookTime: 0, ingredients: ["ladyfingers", "mascarpone", "coffee"], active: true, popularity: 75 },
      { id: 10, name: "Cheesecake", category: "dessert", station: "dessert", price: 8.99, prepTime: 2, cookTime: 0, ingredients: ["cream cheese", "graham crackers"], active: true, popularity: 80 },
      { id: 11, name: "Coffee", category: "beverage", station: "beverage", price: 3.99, prepTime: 2, cookTime: 0, ingredients: ["coffee beans"], active: true, popularity: 90 },
      { id: 12, name: "Iced Tea", category: "beverage", station: "beverage", price: 2.99, prepTime: 1, cookTime: 0, ingredients: ["tea"], active: true, popularity: 70 }
    ];
  }

  getDefaultInventory() {
    return [
      { name: "lettuce", quantity: 50, unit: "heads", minQuantity: 10, status: "good", lastUpdated: new Date().toISOString() },
      { name: "chicken wings", quantity: 200, unit: "lbs", minQuantity: 50, status: "good", lastUpdated: new Date().toISOString() },
      { name: "ribeye", quantity: 30, unit: "steaks", minQuantity: 10, status: "good", lastUpdated: new Date().toISOString() },
      { name: "salmon", quantity: 25, unit: "fillets", minQuantity: 8, status: "good", lastUpdated: new Date().toISOString() },
      { name: "pasta", quantity: 40, unit: "lbs", minQuantity: 10, status: "good", lastUpdated: new Date().toISOString() },
      { name: "potatoes", quantity: 100, unit: "lbs", minQuantity: 20, status: "good", lastUpdated: new Date().toISOString() },
      { name: "parmesan", quantity: 15, unit: "lbs", minQuantity: 5, status: "good", lastUpdated: new Date().toISOString() },
      { name: "mozzarella", quantity: 20, unit: "lbs", minQuantity: 5, status: "good", lastUpdated: new Date().toISOString() }
    ];
  }

  getDefaultStaff() {
    return [
      { id: 1, name: "John Smith", role: "head_chef", station: "grill", active: true, ordersCompleted: 0 },
      { id: 2, name: "Maria Garcia", role: "sous_chef", station: "saute", active: true, ordersCompleted: 0 },
      { id: 3, name: "David Lee", role: "line_cook", station: "fry", active: true, ordersCompleted: 0 },
      { id: 4, name: "Sarah Johnson", role: "prep_cook", station: "salad", active: true, ordersCompleted: 0 }
    ];
  }
}

// ==================== MAIN COMPONENT ====================

const EnhancedRestaurantKDS = () => {
  const [db] = useState(() => new RestaurantDatabase());
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [staff, setStaff] = useState([]);
  const [selectedStation, setSelectedStation] = useState('all');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeView, setActiveView] = useState('orders'); // orders, analytics, inventory, menu, settings
  const [stats, setStats] = useState({
    totalOrders: 0,
    completedToday: 0,
    avgPrepTime: 0,
    activeOrders: 0,
    revenue: 0,
    efficiency: 0
  });
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('today');
  const [showNewMenuItemForm, setShowNewMenuItemForm] = useState(false);
  const orderIdCounter = useRef(1000);

  // Load data from database
  useEffect(() => {
    const data = db.load();
    setOrders(data.orders || []);
    setMenuItems(data.menuItems || []);
    setInventory(data.inventory || []);
    setStaff(data.staff || []);
  }, [db]);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Update stats
  useEffect(() => {
    const active = orders.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length;
    const completed = orders.filter(o => o.status === 'completed').length;
    const cancelled = orders.filter(o => o.status === 'cancelled').length;
    
    const completedOrders = orders.filter(o => o.status === 'completed');
    const avgTime = completedOrders.length > 0 
      ? completedOrders.reduce((sum, o) => sum + (o.actualTime || o.estimatedTime), 0) / completedOrders.length 
      : 0;
    
    const revenue = orders
      .filter(o => o.status === 'completed')
      .reduce((sum, o) => sum + (o.total || 0), 0);
    
    const onTimeOrders = completedOrders.filter(o => (o.actualTime || 0) <= o.estimatedTime).length;
    const efficiency = completedOrders.length > 0 ? (onTimeOrders / completedOrders.length) * 100 : 0;

    setStats({
      totalOrders: orders.length,
      completedToday: completed,
      avgPrepTime: Math.round(avgTime),
      activeOrders: active,
      revenue: revenue.toFixed(2),
      efficiency: Math.round(efficiency),
      cancelledOrders: cancelled
    });
  }, [orders]);

  // Notification system
  const addNotification = (message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date()
    };
    setNotifications(prev => [notification, ...prev].slice(0, 10));
    
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notification.id));
    }, 5000);
  };

  // Auto-generate orders with realistic patterns
  useEffect(() => {
    const generateOrder = () => {
      const tableNumber = Math.floor(Math.random() * 25) + 1;
      const numItems = Math.floor(Math.random() * 4) + 1;
      const selectedItems = [];
      const orderMenuItems = [...menuItems].filter(m => m.active);
      
      for (let i = 0; i < numItems; i++) {
        const randomItem = orderMenuItems[Math.floor(Math.random() * orderMenuItems.length)];
        if (randomItem) {
          selectedItems.push({
            id: randomItem.id,
            name: randomItem.name,
            station: randomItem.station,
            prepTime: randomItem.prepTime,
            cookTime: randomItem.cookTime,
            price: randomItem.price,
            status: 'pending',
            special: Math.random() > 0.8 ? 'No salt' : null
          });
        }
      }

      if (selectedItems.length === 0) return;

      const stationTimes = {};
      selectedItems.forEach(item => {
        const totalTime = item.prepTime + item.cookTime;
        if (!stationTimes[item.station] || stationTimes[item.station] < totalTime) {
          stationTimes[item.station] = totalTime;
        }
      });
      const estimatedTime = Math.max(...Object.values(stationTimes));

      const total = selectedItems.reduce((sum, item) => sum + item.price, 0);

      const newOrder = {
        id: orderIdCounter.current++,
        tableNumber,
        items: selectedItems,
        status: 'pending',
        priority: Math.random() > 0.85 ? 'rush' : 'normal',
        estimatedTime,
        startTime: Date.now(),
        total,
        customerName: `Customer ${tableNumber}`,
        server: staff[Math.floor(Math.random() * staff.length)]?.name || 'Server'
      };

      const savedOrder = db.addOrder(newOrder);
      setOrders(prev => [savedOrder, ...prev]);
      addNotification(`New order #${newOrder.id} for Table ${newOrder.tableNumber}`, 'info');

      // Check inventory
      selectedItems.forEach(item => {
        const menuItem = menuItems.find(m => m.id === item.id);
        if (menuItem && menuItem.ingredients) {
          menuItem.ingredients.forEach(ingredient => {
            const invItem = inventory.find(i => i.name === ingredient);
            if (invItem && invItem.quantity < invItem.minQuantity) {
              addNotification(`Low inventory: ${ingredient}`, 'warning');
            }
          });
        }
      });
    };

    // Generate initial orders
    if (menuItems.length > 0 && orders.length < 3) {
      for (let i = 0; i < 3; i++) {
        setTimeout(() => generateOrder(), i * 1500);
      }
    }

    // Continue generating orders
    const interval = setInterval(() => {
      if (Math.random() > 0.3) { // 70% chance
        generateOrder();
      }
    }, 20000);

    return () => clearInterval(interval);
  }, [menuItems, staff, inventory]);

  const updateOrderStatus = (orderId, newStatus) => {
    const updates = { status: newStatus };
    
    if (newStatus === 'in-progress') {
      updates.progressStartTime = Date.now();
    }
    
    if (newStatus === 'completed') {
      const order = orders.find(o => o.id === orderId);
      if (order) {
        const actualTime = (Date.now() - order.startTime) / 60000;
        updates.actualTime = Math.round(actualTime);
        updates.completedTime = Date.now();
        addNotification(`Order #${orderId} completed in ${updates.actualTime}m!`, 'success');
      }
    }

    if (newStatus === 'cancelled') {
      addNotification(`Order #${orderId} cancelled`, 'warning');
    }
    
    db.updateOrder(orderId, updates);
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, ...updates } : order
    ));
  };

  const updateItemStatus = (orderId, itemId, newStatus) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const updatedItems = order.items.map(item => 
      item.id === itemId ? { ...item, status: newStatus } : item
    );
    
    const allCompleted = updatedItems.every(item => item.status === 'completed');
    const anyInProgress = updatedItems.some(item => item.status === 'in-progress');
    
    let orderStatus = order.status;
    if (allCompleted) {
      orderStatus = 'ready';
    } else if (anyInProgress && orderStatus === 'pending') {
      orderStatus = 'in-progress';
    }
    
    db.updateOrder(orderId, { items: updatedItems, status: orderStatus });
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, items: updatedItems, status: orderStatus } : o
    ));
  };

  const getElapsedTime = (startTime) => {
    return Math.floor((Date.now() - startTime) / 60000);
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'urgent': return 'bg-red-100 border-red-500';
      case 'rush': return 'bg-orange-100 border-orange-500';
      default: return 'bg-white border-gray-300';
    }
  };

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case 'urgent': return <span className="px-2 py-1 bg-red-600 text-white text-xs rounded font-bold">URGENT</span>;
      case 'rush': return <span className="px-2 py-1 bg-orange-500 text-white text-xs rounded font-bold">RUSH</span>;
      default: return null;
    }
  };

  // Add new menu item
  const handleAddMenuItem = (itemData) => {
    db.addMenuItem(itemData);
    setMenuItems(db.load().menuItems);
    setShowNewMenuItemForm(false);
    addNotification('Menu item added successfully', 'success');
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    let matches = true;
    
    if (selectedStation !== 'all') {
      matches = matches && order.items.some(item => item.station === selectedStation);
    }
    
    if (searchQuery) {
      matches = matches && (
        order.id.toString().includes(searchQuery) ||
        order.tableNumber.toString().includes(searchQuery) ||
        order.customerName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (dateFilter === 'today') {
      const today = new Date().toDateString();
      matches = matches && new Date(order.createdAt).toDateString() === today;
    }
    
    return matches;
  });

  const activeOrders = filteredOrders.filter(o => 
    o.status !== 'completed' && o.status !== 'cancelled'
  );

  // ==================== RENDER VIEWS ====================

  const renderOrdersView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {activeOrders.map(order => (
        <div 
          key={order.id} 
          className={`rounded-lg border-2 p-4 shadow-lg ${getPriorityColor(order.priority)}`}
        >
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-300">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl font-bold text-slate-900">#{order.id}</span>
                {getPriorityBadge(order.priority)}
              </div>
              <div className="text-sm text-slate-600">Table {order.tableNumber}</div>
              <div className="text-xs text-slate-500">{order.customerName}</div>
              <div className="text-xs text-blue-600">Server: {order.server}</div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-slate-700 mb-1">
                <Timer className="w-4 h-4" />
                <span className="font-mono font-bold">{getElapsedTime(order.startTime)}m</span>
                <span className="text-slate-500">/ {order.estimatedTime}m</span>
              </div>
              <div className="text-lg font-bold text-green-600">${order.total?.toFixed(2)}</div>
              {getElapsedTime(order.startTime) > order.estimatedTime && (
                <div className="text-xs text-red-600 font-bold">⚠ DELAYED</div>
              )}
            </div>
          </div>

          <div className="space-y-2 mb-4">
            {order.items.map((item, idx) => (
              <div 
                key={idx}
                className="p-3 rounded bg-slate-800 border border-slate-600"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="font-medium text-white">{item.name}</span>
                  </div>
                  <span className="text-xs text-slate-400 capitalize px-2 py-1 bg-slate-700 rounded">
                    {item.station}
                  </span>
                </div>
                {item.special && (
                  <div className="text-xs text-yellow-400 mb-2">⚠ {item.special}</div>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => updateItemStatus(order.id, item.id, 'in-progress')}
                    disabled={item.status !== 'pending'}
                    className={`flex-1 px-3 py-1 rounded text-sm font-medium transition ${
                      item.status === 'in-progress'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-50'
                    }`}
                  >
                    {item.status === 'in-progress' ? '🔥 Cooking' : 'Start'}
                  </button>
                  <button
                    onClick={() => updateItemStatus(order.id, item.id, 'completed')}
                    disabled={item.status === 'completed'}
                    className={`flex-1 px-3 py-1 rounded text-sm font-medium transition ${
                      item.status === 'completed'
                        ? 'bg-green-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-50'
                    }`}
                  >
                    {item.status === 'completed' ? '✓ Done' : 'Complete'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            {order.status === 'ready' && (
              <button
                onClick={() => updateOrderStatus(order.id, 'completed')}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition"
              >
                ✓ Serve Order
              </button>
            )}
            {order.status !== 'ready' && order.status !== 'completed' && (
              <button
                onClick={() => updateOrderStatus(order.id, 'in-progress')}
                disabled={order.status === 'in-progress'}
                className={`flex-1 font-bold py-2 px-4 rounded transition ${
                  order.status === 'in-progress'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {order.status === 'in-progress' ? '⏳ In Progress' : 'Start Order'}
              </button>
            )}
            <button
              onClick={() => updateOrderStatus(order.id, 'cancelled')}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition"
              title="Cancel Order"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ))}
      
      {activeOrders.length === 0 && (
        <div className="col-span-full text-center py-20">
          <ChefHat className="w-20 h-20 text-slate-600 mx-auto mb-4" />
          <p className="text-2xl text-slate-400">No active orders</p>
          <p className="text-slate-500 mt-2">New orders will appear here automatically</p>
        </div>
      )}
    </div>
  );

  const renderAnalyticsView = () => {
    const completedOrders = orders.filter(o => o.status === 'completed');
    const todayOrders = completedOrders.filter(o => {
      const today = new Date().toDateString();
      return new Date(o.createdAt).toDateString() === today;
    });

    const hourlyData = Array.from({ length: 24 }, (_, hour) => {
      const ordersInHour = todayOrders.filter(o => {
        const orderHour = new Date(o.createdAt).getHours();
        return orderHour === hour;
      });
      return {
        hour: `${hour}:00`,
        orders: ordersInHour.length,
        revenue: ordersInHour.reduce((sum, o) => sum + (o.total || 0), 0)
      };
    });

    const popularItems = {};
    completedOrders.forEach(order => {
      order.items.forEach(item => {
        if (!popularItems[item.name]) {
          popularItems[item.name] = { count: 0, revenue: 0 };
        }
        popularItems[item.name].count++;
        popularItems[item.name].revenue += item.price || 0;
      });
    });

    const topItems = Object.entries(popularItems)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 10);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <ShoppingCart className="w-8 h-8" />
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.totalOrders}</div>
            <div className="text-blue-200">Total Orders</div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="w-8 h-8" />
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold mb-1">${stats.revenue}</div>
            <div className="text-green-200">Revenue Today</div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8" />
              <Activity className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.efficiency}%</div>
            <div className="text-purple-200">Efficiency</div>
          </div>

          <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <Timer className="w-8 h-8" />
              <Zap className="w-6 h-6" />
            </div>
            <div className="text-3xl font-bold mb-1">{stats.avgPrepTime}m</div>
            <div className="text-orange-200">Avg Prep Time</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-400" />
              Top Selling Items
            </h3>
            <div className="space-y-3">
              {topItems.map(([name, data], idx) => (
                <div key={name} className="flex items-center gap-3">
                  <div className="text-2xl font-bold text-slate-500 w-8">{idx + 1}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium">{name}</span>
                      <span className="text-sm text-slate-400">{data.count} orders</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        style={{ width: `${(data.count / topItems[0][1].count) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-green-400 font-bold">${data.revenue.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Activity className="w-6 h-6 text-green-400" />
              Hourly Performance
            </h3>
            <div className="space-y-2">
              {hourlyData.filter(d => d.orders > 0).slice(-12).map(data => (
                <div key={data.hour} className="flex items-center gap-3">
                  <div className="text-sm text-slate-400 w-16">{data.hour}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">{data.orders} orders</span>
                      <span className="text-sm text-green-400">${data.revenue.toFixed(2)}</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                        style={{ width: `${(data.orders / Math.max(...hourlyData.map(d => d.orders))) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderInventoryView = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Inventory Management</h2>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {inventory.map((item, idx) => (
          <div 
            key={idx} 
            className={`bg-slate-800 rounded-lg p-4 border-2 ${
              item.status === 'low' ? 'border-red-500' : 'border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Package className={`w-6 h-6 ${item.status === 'low' ? 'text-red-500' : 'text-green-500'}`} />
                <span className="font-bold capitalize">{item.name}</span>
              </div>
              {item.status === 'low' && (
                <span className="px-2 py-1 bg-red-600 text-white text-xs rounded font-bold">LOW</span>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Current:</span>
                <span className="font-bold">{item.quantity} {item.unit}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Minimum:</span>
                <span>{item.minQuantity} {item.unit}</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${item.status === 'low' ? 'bg-red-500' : 'bg-green-500'}`}
                  style={{ width: `${Math.min((item.quantity / item.minQuantity) * 50, 100)}%` }}
                />
              </div>
              <div className="text-xs text-slate-500">
                Updated: {new Date(item.lastUpdated).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMenuView = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Menu Management</h2>
        <button 
          onClick={() => setShowNewMenuItemForm(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Menu Item
        </button>
      </div>

      {showNewMenuItemForm && (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-4">
          <h3 className="text-lg font-bold mb-4">New Menu Item</h3>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            handleAddMenuItem({
              name: formData.get('name'),
              category: formData.get('category'),
              station: formData.get('station'),
              price: parseFloat(formData.get('price')),
              prepTime: parseInt(formData.get('prepTime')),
              cookTime: parseInt(formData.get('cookTime')),
              active: true,
              popularity: 50
            });
          }}>
            <div className="grid grid-cols-2 gap-4">
              <input name="name" placeholder="Item Name" required className="px-3 py-2 bg-slate-700 rounded" />
              <input name="price" type="number" step="0.01" placeholder="Price" required className="px-3 py-2 bg-slate-700 rounded" />
              <select name="category" required className="px-3 py-2 bg-slate-700 rounded">
                <option value="">Select Category</option>
                <option value="appetizer">Appetizer</option>
                <option value="main">Main</option>
                <option value="side">Side</option>
                <option value="dessert">Dessert</option>
                <option value="beverage">Beverage</option>
              </select>
              <select name="station" required className="px-3 py-2 bg-slate-700 rounded">
                <option value="">Select Station</option>
                <option value="grill">Grill</option>
                <option value="fry">Fry</option>
                <option value="saute">Sauté</option>
                <option value="salad">Salad</option>
                <option value="dessert">Dessert</option>
                <option value="beverage">Beverage</option>
              </select>
              <input name="prepTime" type="number" placeholder="Prep Time (min)" required className="px-3 py-2 bg-slate-700 rounded" />
              <input name="cookTime" type="number" placeholder="Cook Time (min)" required className="px-3 py-2 bg-slate-700 rounded" />
            </div>
            <div className="flex gap-2 mt-4">
              <button type="submit" className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded">
                Save Item
              </button>
              <button 
                type="button" 
                onClick={() => setShowNewMenuItemForm(false)}
                className="px-4 py-2 bg-slate-600 hover:bg-slate-700 rounded"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map(item => (
          <div key={item.id} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-lg">{item.name}</h3>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm">{item.popularity}</span>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Category:</span>
                <span className="capitalize">{item.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Station:</span>
                <span className="capitalize">{item.station}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Price:</span>
                <span className="text-green-400 font-bold">${item.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Time:</span>
                <span>{item.prepTime + item.cookTime} min</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className={item.active ? 'text-green-400' : 'text-red-400'}>
                  {item.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="flex-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm">
                Edit
              </button>
              <button className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <ChefHat className="w-10 h-10 text-orange-500" />
            <div>
              <h1 className="text-3xl font-bold">Advanced Kitchen Display System</h1>
              <p className="text-slate-400">Full Stack Restaurant Management</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Bell className="w-6 h-6 text-yellow-400 cursor-pointer" />
            <div className="flex items-center gap-2 text-right">
              <Clock className="w-5 h-5 text-blue-400" />
              <div>
                <div className="text-2xl font-mono">{currentTime.toLocaleTimeString()}</div>
                <div className="text-sm text-slate-400">{currentTime.toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-slate-400 text-sm">Active</span>
            </div>
            <div className="text-3xl font-bold text-blue-400">{stats.activeOrders}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-slate-400 text-sm">Completed</span>
            </div>
            <div className="text-3xl font-bold text-green-400">{stats.completedToday}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <Timer className="w-5 h-5 text-yellow-400" />
              <span className="text-slate-400 text-sm">Avg Time</span>
            </div>
            <div className="text-3xl font-bold text-yellow-400">{stats.avgPrepTime}m</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              <span className="text-slate-400 text-sm">Revenue</span>
            </div>
            <div className="text-2xl font-bold text-green-400">${stats.revenue}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-purple-400" />
              <span className="text-slate-400 text-sm">Efficiency</span>
            </div>
            <div className="text-3xl font-bold text-purple-400">{stats.efficiency}%</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-orange-400" />
              <span className="text-slate-400 text-sm">Total</span>
            </div>
            <div className="text-3xl font-bold text-orange-400">{stats.totalOrders}</div>
          </div>
        </div>

        {/* Notifications */}
        {notifications.length > 0 && (
          <div className="space-y-2 mb-4">
            {notifications.slice(0, 3).map(notif => (
              <div 
                key={notif.id} 
                className={`p-3 rounded-lg flex items-center gap-3 ${
                  notif.type === 'warning' ? 'bg-orange-900/50 border border-orange-600' :
                  notif.type === 'success' ? 'bg-green-900/50 border border-green-600' :
                  'bg-blue-900/50 border border-blue-600'
                }`}
              >
                <AlertCircle className="w-5 h-5" />
                <span>{notif.message}</span>
                <span className="ml-auto text-xs text-slate-400">
                  {notif.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => setActiveView('orders')}
            className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
              activeView === 'orders' 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
            Orders
          </button>
          <button
            onClick={() => setActiveView('analytics')}
            className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
              activeView === 'analytics' 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <BarChart3 className="w-5 h-5" />
            Analytics
          </button>
          <button
            onClick={() => setActiveView('inventory')}
            className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
              activeView === 'inventory' 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Package className="w-5 h-5" />
            Inventory
          </button>
          <button
            onClick={() => setActiveView('menu')}
            className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
              activeView === 'menu' 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Database className="w-5 h-5" />
            Menu
          </button>
        </div>

        {/* Filters (for orders view) */}
        {activeView === 'orders' && (
          <div className="flex gap-2 flex-wrap mb-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
              />
            </div>
            
            <button
              onClick={() => setSelectedStation('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedStation === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All Stations
            </button>
            {['grill', 'fry', 'saute', 'salad', 'dessert', 'beverage'].map(station => (
              <button
                key={station}
                onClick={() => setSelectedStation(station)}
                className={`px-4 py-2 rounded-lg font-medium transition capitalize ${
                  selectedStation === station 
                    ? 'bg-orange-600 text-white' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {station}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      {activeView === 'orders' && renderOrdersView()}
      {activeView === 'analytics' && renderAnalyticsView()}
      {activeView === 'inventory' && renderInventoryView()}
      {activeView === 'menu' && renderMenuView()}
    </div>
  );
};

export default EnhancedRestaurantKDS;