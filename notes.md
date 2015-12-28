## Post-install

- Create an *admin* user
- Promote the *admin* user with an admin role :
```
db.users.update({'username' : 'admin'}, {$push : {'roles' :'admin'}})
```
