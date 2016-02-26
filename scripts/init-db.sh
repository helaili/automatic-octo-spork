mongo localhost/aos-dev <<'EOF'
  db.sporks.remove({});
EOF

mongoimport --db aos-dev --collection sporks ./json/spork.json
