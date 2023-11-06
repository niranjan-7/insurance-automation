# Insurance Automation Backend

Install requirements.
`mypy` takes some time to install
```
pip install -r requirements.txt
```

Initialise environment variables.
```
FLASK_APP=main.py
FLASK_DEBUG=1
POSTGRES_URL=dpg-cgbldng2qv267u9b64mg-a.singapore-postgres.render.com
POSTGRES_USER=postgre
POSTGRES_PASSWORD=SIyVfh2lEB7aEGCpA1ske0UnEIb3HMWi
POSTGRES_DB=insurance_l6xg
JWT_SECRET_KEY=0wHdbSR_i2hi8Tji_R21orIHLNWGp3JAqeLjPJHBuCeHa6AkrKWvDQs6UCeNTW
```

Run migrations
``` 
./run-migrations.sh
```

Run flask
```
flask run
```

Check endpoint

Open: http://localhost:5000/healthcheck

## PSQL Command

```
PGPASSWORD=SIyVfh2lEB7aEGCpA1ske0UnEIb3HMWi psql -h dpg-cgbldng2qv267u9b64mg-a.singapore-postgres.render.com -U postgre insurance_l6xg
```
