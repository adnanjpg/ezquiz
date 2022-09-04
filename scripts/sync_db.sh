#!/usr/bin/env bash

# this will sync the local prisma schema
# with our online db (currently PlanetScale)
# https://planetscale.com/blog/how-to-setup-next-js-with-prisma-and-planetscale

# run thiss script whenever you change the
# schema of your db.

npx prisma db push