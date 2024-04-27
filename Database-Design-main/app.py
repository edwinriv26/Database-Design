from flask import Flask, render_template, request, redirect, url_for, flash
from flask_mysqldb import MySQL
from flask import session
from datetime import datetime, timedelta, date
from flask import jsonify, request
import re

app = Flask(__name__, template_folder='templates')
app.secret_key = 'secret_key'

# MySQL Configuration
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'C@staneda2024!'
app.config['MYSQL_DB'] = 'user'

mysql = MySQL(app)

# Function to validate email format
def validate_email(email):
    return bool(re.match(r'^[\w\.-]+@[\w\.-]+$', email))

# Function to validate name format (contains only letters)
def validate_name(name):
    return bool(re.match(r'^[a-zA-Z]+$', name))

# Function to validate password format
def validate_password(password):
    # Password should contain at least six characters, at least one number,
    # at least one uppercase letter, and at least one special character
    # that does not include a single quote and double quote.
    return bool(re.match(r'^(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+{}|:<>?,./-])[A-Za-z\d~!@#$%^&*()_+{}|:<>?,./-]{6,}$', password))

# Function to check if user has posted maximum item for the day
def check_item_post_limit(username):
    today = datetime.now().date()
    cur = mysql.connection.cursor()
    cur.execute("SELECT COUNT(*) FROM item WHERE username = %s AND DATE(itemcreated_at) = %s", (username, today))
    count = cur.fetchone()[0]
    cur.close()
    return count >= 2



# Routes
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        confirm_password = request.form['confirm_password']
        first_name = request.form['first_name']
        last_name = request.form['last_name']
        email = request.form['email']

        # Validate email format
        if not validate_email(email):
            flash('Invalid email format', 'error')
            return redirect(url_for('home'))

        # Validate password length and format
        if not validate_password(password):
            flash('Password must be at least 6 characters long and meet the requirements', 'error')
            return redirect(url_for('home'))

        # Validate first name format
        if not validate_name(first_name):
            flash('First name must contain only letters', 'error')
            return redirect(url_for('home'))

        # Validate last name format
        if not validate_name(last_name):
            flash('Last name must contain only letters', 'error')
            return redirect(url_for('home'))

        # Check if passwords match
        if password != confirm_password:
            flash('Passwords do not match', 'error')
            return redirect(url_for('home'))

        # Check if username or email already exists
        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM login WHERE username = %s OR email = %s", (username, email))
        existing_user = cur.fetchone()
        cur.close()

        if existing_user:
            flash('Username or email already exists', 'error')
            return redirect(url_for('home'))
        else:
            # Insert new user into the database
            cur = mysql.connection.cursor()
            cur.execute("INSERT INTO login (username, password, firstName, lastName, email) VALUES (%s, %s, %s, %s, %s)", (username, password, first_name, last_name, email))
            mysql.connection.commit()
            cur.close()
            flash('Account created successfully', 'success')
            return redirect(url_for('home'))

    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        # Connect to the database
        cur = mysql.connection.cursor()

        # Execute the SQL query to check if the username and password match
        cur.execute("SELECT * FROM login WHERE username = %s AND password = %s", (username, password))
        user = cur.fetchone()

        # Close the database cursor
        cur.close()

        # If a user with matching username and password is found, redirect to home page
        if user:
            flash(f'Login successful. Welcome {username}!', 'success')
            session['username'] = username  # Store the username in session
            session.pop('_flashes', [])  # Clear existing flash messages
            return redirect(url_for('form'))  # Redirect to the postitem route
        else:
            flash('Invalid username or password', 'error')
            return render_template('index.html', flash_messages=session['_flashes'])
            
    # Clear existing flash messages before rendering the login page
    flash_messages = session.pop('_flashes', [])
    return render_template('postitem.html', flash_messages=flash_messages)



@app.route('/logout')
def logout():
    session.pop('username', None)
    flash('Logged out successfully', 'success')
    return redirect(url_for('home'))
    

@app.route('/postitem', methods=['GET', 'POST'])
def postitem():

    if request.method == 'GET':
        if 'username' not in session:
            flash('You need to log in first', 'error')
            return redirect(url_for('login'))
        else:
            return render_template('postitem.html')


    if 'username' not in session:
        flash('You need to log in first', 'error')
        return redirect(url_for('login'))
    
    username = session['username']
    if check_item_post_limit(username):
        flash('You have already posted the maximum number of item for today', 'error')
        session.pop('_flashes', [])  # Clear existing flash messages
        return redirect(url_for('form'))

    
    title = request.form['title']
    description = request.form['description']
    category = request.form['category']
    price = request.form['price']

         
         
    # Get the current timestamp for itemcreated_at
    #from datetime import datetime
    itemcreated_at = datetime.now()

    # Connect to the database
    cur = mysql.connection.cursor()

    # Insert data into the 'item' table
    cur.execute("""
        INSERT INTO item (title, description, category, price, username, itemcreated_at) 
        VALUES (%s, %s, %s, %s, %s, %s)""", 
        (title, description, category, price, username, itemcreated_at))
        
    # Commit the transaction and close the cursor
    mysql.connection.commit()
    cur.close()
    # Handle the form submission and item posting process
    # After successfully posting the item, redirect to the post item page
    flash('Item posted successfully', 'success')
    return redirect(url_for('form'))

    # Render the postitem page
    return render_template('postitem.html')


from flask import jsonify, request

@app.route('/search', methods=['GET', 'POST'])
def search():
    if request.method == 'GET':
        # Handle GET request for rendering the search page
        return render_template('search.html')
    elif request.method == 'POST':
        data = request.get_json()  # Get JSON data sent from the client
        category = data['category']  # Access the category value from JSON
        cur = mysql.connection.cursor()
        query = "SELECT * FROM item WHERE category = %s"
        cur.execute(query, (category,))
        items = cur.fetchall()
        cur.close()

        # Convert query results into a list of dicts to serialize as JSON
        items_list = [{'id': item[0], 'title': item[1], 'category': item[2], 'price': item[3]} for item in items]
        return jsonify(items_list)  # Return JSON response


@app.route('/add_review', methods=['POST'])
def add_review():
    if 'username' not in session:
        return jsonify({'error': 'You must be logged in to add a review'}), 401

    # Checking if the request has JSON body, assuming that it's an AJAX request
    if request.is_json:
        data = request.get_json()
        item_id = data.get('item_id')
        rating = data.get('rating')
        description = data.get('description')
    else:
        item_id = request.form.get('item_id')
        rating = request.form.get('rating')
        description = request.form.get('description')
    
    username = session['username']

    # Check for the review limit per day
    if count_user_reviews_today(username) >= 3:
        message = 'You have already given the maximum number of reviews for today'
        if request.is_json:
            return jsonify({'error': message}), 429
        else:
            flash(message, 'error')
            return redirect(url_for('home'))

    # Insert the review into the database
    try:
        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO reviews (username, item_id, rating, description) VALUES (%s, %s, %s, %s)",
                    (username, item_id, rating, description))
        mysql.connection.commit()
        message = 'Review added successfully!'
        if request.is_json:
            return jsonify({'message': message}), 200
        else:
            flash(message, 'success')
            return redirect(url_for('home'))
    except Exception as e:
        mysql.connection.rollback()
        error_message = str(e)
        if request.is_json:
            return jsonify({'error': error_message}), 500
        else:
            flash(error_message, 'error')
            return redirect(url_for('home'))
    finally:
        cur.close()

def count_user_reviews_today(username):
    today = date.today()
    cur = mysql.connection.cursor()
    cur.execute("SELECT COUNT(*) FROM reviews WHERE username = %s AND DATE(created_at) = %s", (username, today))
    count = cur.fetchone()[0]
    cur.close()
    return count


@app.route('/')
def home():
    #if 'username' in session:  # Check if the user is logged in
    #    return redirect(url_for('postitem'))  # Redirect to the postitem route
    #else:
        return render_template('index.html')
        
@app.route('/form')
def form():
    #if 'username' in session:  # Check if the user is logged in
    #    return redirect(url_for('postitem'))  # Redirect to the postitem route
    #else:
        return render_template('form.html')        
    


if __name__ == '__main__':
    app.run(debug=True)