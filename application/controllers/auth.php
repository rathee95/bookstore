<?php
use Framework\RequestMethods as RM;
use Models\User as User;

class Auth extends Shared\Controller {
	public function _secure() {
		if (!$this->user) {
			$this->_404();
		}
	}

	public function login() {
		$this->seo(['title' => 'User Login']);
		$view = $this->getActionView();
		if (RM::type() === 'POST') {
			$email = RM::post('email');
			$password = RM::post('password');
			$error = "Invalid email/password";

			$user = User::first(['email = ?' => $email]);
			if (!$user || $user->password !== sha1($password)) {
				return $view->set('message', $error);
			}

			$this->setUser($user);
			$this->redirect('/account');
		}
	}

	public function logout() {
		session_destroy();
		$this->redirect("/");
	}

	public function signup() {
		$this->seo(['title' => 'User Signup']);
		$view = $this->getActionView();

		$fields = ['email', 'phone', 'name', 'password'];
		if (RM::type() === 'POST') {
			$user = new User([
			]);

			foreach ($fields as $f) {
				$user->$f = RM::post($f);
			}

			$verify = RM::post('passwordv');
			if ($verify !== $user->password) {
				return $view->set('message', 'Passwords dont match');
			}

			if ($user->validate()) {
				$user->password = sha1($user->password);
				$user->save(); $this->setUser($user);
				$view->set('message', 'Registered success');
				$this->redirect('/account');
			} else {
				var_dump($user->getErrors());
				$view->set("errors", $user->getErrors());
			}
		}
	}

	public function render() {
		$cart_count = 0;
		if ($this->user) {
			$cart_count = Models\Cart::count(["user_id = ?" => $this->user->id, "live = ?" => false]);
		}

		if ($this->layoutView) {
			$this->layoutView->set('cart_count', $cart_count);
		}

		if ($this->actionView) {
			$this->actionView->set('cart_count', $cart_count);
		}
		parent::render();
	}

	public function install() {
        $this->noview();
        $models = Shared\Markup::models();
        foreach ($models as $key => $value) {
            $this->sync($value);
        }
    }
    public function sync($model) {
        $this->noview();
        $db = Framework\Registry::get("database");
        try {
            $class = '\Models\\'. ucfirst($model);
            $class = new $class;
            $db->sync($class);
        } catch (\Exception $e) {
            var_dump($e);
        }
    }
}