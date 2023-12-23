psql -h localhost -f install.sql -U postgres
psql -h localhost -d versys -f structure.sql -U postgres
psql -h localhost -d versys -f data.sql -U postgres