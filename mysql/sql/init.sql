-- Djangoが使用するユーザー（djangouser）にdjangoというDBの全権限を付与
GRANT ALL PRIVILEGES ON django.* TO 'djangouser'@'%';

-- 権限を反映
FLUSH PRIVILEGES;
